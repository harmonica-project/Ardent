const express = require('express'), router = express.Router();
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../data/users');
const { 
    authorizedOnly, 
    isAppAdmin,
    isConcernedUser,
    generateToken 
} = require('../utils/authorization');
const { parseDBResults, intErrResp } = require('../utils/helpers');

router
    .get('/', authorizedOnly, (req, res) => {
        db.getUsers().then((queryResult) => {
            const parsedResult = parseDBResults(queryResult);
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    })
    .get('/substring/:letters', authorizedOnly, (req, res) => {
        db.getUsersBySubstring(req.params.letters).then((queryResult) => {
            const parsedResult = parseDBResults(queryResult);
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    })
    .get('/token', isAppAdmin, (req, res) => {
        const token = crypto.randomBytes(10).toString('hex');
        db.storeInviteToken(token).then((parsedResult) => {
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        });
    })
    .get('/:username', authorizedOnly, (req, res) => {
        var username = req.params.username;
        db.getUser(username).then((parsedResult) => {
            if(parsedResult.success) {
                delete parsedResult.result.hash;
                res.status(200).send(parsedResult);
            }
            else res.status(500).send(parsedResult);
        })
    })
    .put('/:username/information', isConcernedUser('params'), (req, res) => {
        const newUser = req.body;
        if(newUser.first_name && newUser.last_name && newUser.role) {
            db.modifyUser(newUser).then((parsedResult) => {
                if(parsedResult.success) res.status(200).send(parsedResult);
                else res.status(500).send(parsedResult);
            })
        }
        else {
            res.status(500).send({
                success: false,
                errorMsg: "Missing fields."
            })
        }
    })
    .put('/:username/password', isConcernedUser('params'), (req, res) => {
        const newPasswordInfo = req.body;
        if(newPasswordInfo.username && newPasswordInfo.password) {
            bcrypt.hash(newPasswordInfo.password, saltRounds, function(err, hash) {
                db.changeUserPassword(newPasswordInfo.username, hash).then((parsedResult) => {
                    if(parsedResult.success) res.status(200).send(parsedResult);
                    else res.status(500).send(parsedResult);
                })
            });
        }
        else {
            res.status(500).send({
                success: false,
                errorMsg: "Missing fields."
            })
        }
    })
    .post('/register', (req, res) => {
        const newUser = req.body;
        db.getUser(newUser.username).then(userResult => {
            if (!userResult.result) {
                db.consumeInviteToken(newUser.token).then(tokenResult => {
                    if (tokenResult.success) {
                        bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
                            newUser["hash"] = hash;
                            db.createUser(newUser).then(newUserRes => {
                                if(newUserRes.success) res.status(200).send(newUserRes);
                                else res.status(500).send(newUserRes);
                            })
                        });
                    }
                    else {
                        res.status(401).send({ success: false, errorMsg: 'Invalid token.' });
                    }
                });
            }
            else {
                res.status(500).send({ success: false, errorMsg: 'User already exists.' });
            }
        });
    })
    .post('/authenticate', (req, res) => {
        authInfo = req.body;
        db.getUser(authInfo.username).then((queryResult) => {
            if(queryResult.success) {
                try {
                    bcrypt.compare(authInfo.password, queryResult.result.hash, (err, result) => {
                        if(result) {
                            delete queryResult.result.hash;
                            res.status(200).send({
                                user: queryResult.result,
                                token: generateToken(authInfo.username),
                                success: true
                            });
                        }
                        else {
                            res.status(401).send();
                        }
                    });
                }
                catch (error) {
                    res.status(500).send({
                        success: false,
                        errorMsg: error
                    })
                }
            }
            else {
                res.status(500).send({
                    success: false,
                    errorMsg: "Failed to retrieve the hash from DB."
                })
            }
        });
    })
    .get('/:username/projects', isConcernedUser('params'), (req, res) => {
        db.getUserProjects(req.params.username).then((queryResult) => {
            const parsedResult = parseDBResults(queryResult);
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(intErrResp());
        });
      });

module.exports = router;