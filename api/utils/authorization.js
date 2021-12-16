const userDB = require('../data/users');
const projectDB = require('../data/projects');
const { parseDBResults } = require('../utils/helpers');
var nJwt = require('njwt');
var { SIGN_KEY } = require('../config');

module.exports = {
    authorizedOnly: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                const verifiedToken = nJwt.verify(token, SIGN_KEY);
                userDB.getUser(verifiedToken.body.sub).then((parsedResult) => {
                    if(parsedResult.success && parsedResult.result.username) {
                        next();
                    }
                    else res.status(401).send({success: false, errorMsg: 'User does not exists yet token is valid.'});
                })
            }
            catch (error) {
                console.log(error);
                res.status(401).send({success: false, errorMsg: error});
            }
        }
        else res.status(401).send({success: false, errorMsg: 'No token provided.'});
    },
    generateToken: (username) => {
        var claims = {
            iss: "ardent/api",  // The URL of your service
            sub: username,    // The UID of the user in your system
            scope: "self"
        }
        var jwt = nJwt.create(claims,SIGN_KEY);
        jwt.setExpiration(new Date().getTime() + (12*60*60*1000)); // expiration in 12 hours
        var token = jwt.compact();
        return token;
    },
    isItemOwnerOrAdmin: (itemFco, idLocation) => {
        return async (req, res, next) => {
            try {
                const id = req[idLocation].id;
                const questionRes = parseDBResults(await itemFco(id));
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                const verifiedToken = nJwt.verify(token, SIGN_KEY);
                const parsedResult = await userDB.getUser(verifiedToken.body.sub);

                if ((parsedResult.success && parsedResult.result.is_admin) || verifiedToken.body.sub === questionRes.result[0].username) {
                    next();
                } else {
                    res.status(401).send({success: false, errorMsg: 'The user is not an admin of the application and does not own the question, the operation is impossible.'});
                }
            }
            catch (err) {
                console.log(err);
                res.status(401).send({success: false, errorMsg: 'Invalid JWT or question ID, impossible to authentify user.'});
            }
        };
    },
    isAppAdmin: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const verifiedToken = nJwt.verify(token, SIGN_KEY);
            const parsedResult = await userDB.getUser(verifiedToken.body.sub)
            if(parsedResult.success && parsedResult.result.is_admin) next();
            else res.status(401).send({success: false, errorMsg: 'The user is not an admin of the application, the operation is impossible.'});
        }
        catch {
            res.status(401).send({success: false, errorMsg: 'Invalid JWT, impossible to authentify user.'});
        }
    },
    isProjectAdmin: (urlLocation) => {
        return async (req, res, next) => {
            try {
                const url = req[urlLocation].url;
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                const verifiedToken = nJwt.verify(token, SIGN_KEY);
                const isAdmin = await projectDB.isProjectAdmin(url, verifiedToken.body.sub)
                if(isAdmin) next();
                else res.status(401).send({success: false, errorMsg: 'The user is not an admin of the project, the operation is impossible.'});
            }
            catch (error) {
                console.log(error);
                res.status(401).send({success: false, errorMsg: 'Invalid JWT, impossible to authentify user.'});
            }
        }
    },
    isConcernedUser: (usernameLocation) => {
        return async (req, res, next) => {
            try {
                const username = req[usernameLocation].username;
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                const verifiedToken = nJwt.verify(token, SIGN_KEY);
                if(username === verifiedToken.body.sub) next();
                else res.status(401).send({success: false, errorMsg: 'The authentified user is not the same as specified in the request.'});
            }
            catch {
                res.status(401).send({success: false, errorMsg: 'Invalid JWT, impossible to authentify user.'});
            }
        };
    },
}