const express = require('express');
const app = express();
const db = require('./db');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './uploads/' }).single("xlsArchitectures");
const xlsxj = require("xlsx-to-json");
const { v4: uuidv4 } = require('uuid');
const { storeArchitecture } = require('./db');
var nJwt = require('njwt');
var crypto = require("crypto");
var { SIGN_KEY } = require('./config');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const parseDBResults = res => {
    if(res["rows"]) {
        return {
            success: true,
            result: res["rows"]
        }
    }
    else {
        return {
            success: false,
            errorMsg: "Failed connexion to DB" + JSON.stringify(res)
        }
    }
}

const authorizedOnly = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const verifiedToken = nJwt.verify(token, SIGN_KEY);
        db.getUser(verifiedToken.body.sub).then((parsedResult) => {
            if(parsedResult.success && parsedResult.result.username) {
                next();
            }
            else res.status(401).send({success: false, errorMsg: 'User does not exists yet token is valid.'});
        })
    }
    catch (error) {
        res.status(401).send({success: false, errorMsg: error});
    }
}

const verifyClaimIdentity = async (username, req) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const verifiedToken = nJwt.verify(token, SIGN_KEY);
        if (verifiedToken.body.sub === username) {
            parsedResult = await db.getUser(username);
            if(parsedResult.success && parsedResult.result.username == username) {
                return true;
            }
            else return false;
        }
        return false;
    }
    catch {
        // failed to verify token
        return false;
    }
}

const verifyClaimAdmin = async (req) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const verifiedToken = nJwt.verify(token, SIGN_KEY);
        const parsedResult = await db.getUser(verifiedToken.body.sub)
        if(parsedResult.success && parsedResult.result.is_admin) {
            return true;
        }
        else return false;
    }
    catch {
        // failed to verify token
        return false;
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "content-type, authorization");
    res.header("Access-Control-Allow-Credentials", true);

    if(req.method == "OPTIONS") {
        res.status(204).send()
    }
    else {
        next();
    }
});

const generateToken = (username) => {
    var claims = {
        iss: "ardent/api",  // The URL of your service
        sub: username,    // The UID of the user in your system
        scope: "self"
    }
    var jwt = nJwt.create(claims,SIGN_KEY);
    jwt.setExpiration(new Date().getTime() + (12*60*60*1000)); // expiration in 12 hours
    var token = jwt.compact();
    return token;
}

app.post('/users/authenticate', (req, res) => {
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
});

app.get('/architectures', authorizedOnly, (req, res) => {
    db.getArchitectures().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/papers', authorizedOnly, (req, res) => {
    db.getPapers().then(parsedResult => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/components', authorizedOnly, (req, res) => {
    db.getFullComponents().then(queryResult => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.post('/architecture', authorizedOnly, (req, res) => {
    const newArchitecture = req.body;
    if(newArchitecture.name && newArchitecture.paper_id && newArchitecture.reader_description) {
        db.storeArchitecture(newArchitecture).then((parsedResult) => {
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
});

app.post('/paper', authorizedOnly, (req, res) => {
    const newPaper = req.body;
    if(newPaper.name && newPaper.authors && newPaper.added_by && newPaper.updated_by) {
        db.storePaper(newPaper).then((parsedResult) => {
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
});

app.post('/property', authorizedOnly, (req, res) => {
    db.storeProperty(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.post('/connection', authorizedOnly, (req, res) => {
    db.storeConnection(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/architecture/:id', authorizedOnly, (req, res) => {
    db.deleteArchitecture(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/property/:id', authorizedOnly, (req, res) => {
    db.deleteProperty(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/connection/:id', authorizedOnly, (req, res) => {
    db.deleteConnection(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/component_base/:id', authorizedOnly, (req, res) => {
    db.deleteBaseComponent(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});


app.post('/component_instance', authorizedOnly, (req, res) => {
    db.storeComponentInstance(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.put('/component_instance/:id', authorizedOnly, (req, res) => {
    const newComponent = req.body;
    if(newComponent.name.length > 0 && newComponent.architecture_id && newComponent.id) {
        db.modifyComponentInstance(newComponent).then((parsedResult) => {
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
});

app.post('/component_base', authorizedOnly, (req, res) => {
    db.storeComponentBase(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.put('/component_base/:id', authorizedOnly, (req, res) => {
    const newComponent = req.body;
    if(newComponent.name.length > 0 && newComponent.id) {
        db.modifyComponentBase(newComponent).then((parsedResult) => {
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
});

app.put('/paper/:id', authorizedOnly, (req, res) => {
    const newPaper = req.body;
    if(newPaper.name && newPaper.name.length > 0 && newPaper.authors && newPaper.added_by && newPaper.updated_by) {
        db.modifyPaper(newPaper).then((parsedResult) => {
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
});


app.put('/architecture/:id', authorizedOnly, (req, res) => {
    const newArchitecture = req.body;
    if(newArchitecture.reader_description && newArchitecture.name && newArchitecture.id) {
        db.modifyArchitecture(newArchitecture).then((parsedResult) => {
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
});

app.post('/user/register', (req, res) => {
    const newUser = req.body;
    db.getUser(newUser.username).then(userResult => {
        if (!userResult.result) {
            db.consumeInviteToken(newUser.token).then(tokenResult => {
                console.log(tokenResult);
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
});

app.put('/user/:username/information', authorizedOnly, (req, res) => {
    const newUser = req.body;
    verifyClaimIdentity(newUser.username, req).then(isSameUser => {
        if (isSameUser) {
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
        }
        else {
            res.status(403).send({success: false, errorMsg: "You are not the user concerned by this request."});
        }
    });
});

app.put('/user/:username/password', authorizedOnly, (req, res) => {
    const newPasswordInfo = req.body;
    verifyClaimIdentity(newPasswordInfo.username, req).then(isSameUser => {
        if (isSameUser) {
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
        }
        else {
            res.status(403).send({success: false, errorMsg: "You are not the user concerned by this request."});
        }
    })
});

app.post('/xls', authorizedOnly, async (req, res) => {
    await upload(req, res, async (err) => {
        try {
            await xlsxj({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //we don't need output
            }, async (err, result) => {
                if(err) {
                    res.status(500).send({
                        success: false,
                        errorMsg: "Conversion failed: " + e
                    });
                }
                
                var storeSuccessCounter = 0;
                
                for(var i = 0; i < result.length; i++) {
                    if(result[i].title.length != 0 && result[i].abstract.length != 0) {
                        var storeResult = await storeArchitecture({
                            id: uuidv4(),
                            paper: result[i].title,
                            reader_description: result[i].abstract,
                            done_by: ""
                        })

                        if(storeResult["success"]) storeSuccessCounter++;
                    }
                }

                res.status(200).send({
                    success: true,
                    nbSuccessAdding: storeSuccessCounter,
                    nbFailedAdding: (result.length - storeSuccessCounter)
                });
            });
        } catch (e){
            res.status(500).send({
                success: false,
                errorMsg: "Conversion failed: " + e
            });
        }

        res.status(200)
    })
});

app.delete('/component_instance/:id', authorizedOnly, (req, res) => {
    db.deleteComponentInstance(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/paper/:id', authorizedOnly, (req, res) => {
    db.deletePaper(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/component_instance', authorizedOnly, (req, res) => {
    db.getComponentsInstances().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/component_base', authorizedOnly, (req, res) => {
    db.getBaseComponents().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/admin/invite_token', authorizedOnly, (req, res) => {
    verifyClaimAdmin(req).then(isAdmin => {
        if (isAdmin) {
            const token = crypto.randomBytes(10).toString('hex');
            db.storeInviteToken(token).then((parsedResult) => {
                if(parsedResult.success) res.status(200).send(parsedResult);
                else res.status(500).send(parsedResult);
            })
        }
        else {
            res.status(500).send({
                success: false,
                errorMsg: "User role verification failed."
            })
        }
    });
});

app.get('/components_names', authorizedOnly, (req, res) => {
    db.getComponentsNames().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/users', authorizedOnly, (req, res) => {
    db.getUsers().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/properties_names/:cname', authorizedOnly, (req, res) => {
    var cname = req.params.cname;
    db.getPropertiesNames(cname).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/properties_names/', authorizedOnly, (req, res) => {
    db.getPropertiesNames().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/properties_values/:pkey', authorizedOnly, (req, res) => {
    var pkey = req.params.pkey;
    db.getPropertyValues(pkey).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/architecture/:id', authorizedOnly, (req, res) => {
    var id = req.params.id;
    db.getArchitecture(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/user/:username', authorizedOnly, (req, res) => {
    var username = req.params.username;
    db.getUser(username).then((parsedResult) => {
        if(parsedResult.success) {
            delete parsedResult.result.hash;
            res.status(200).send(parsedResult);
        }
        else res.status(500).send(parsedResult);
    })
});

app.get('/component_instance/:id', authorizedOnly, (req, res) => {
    var id = req.params.id;
    db.getComponentInstance(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

var httpServer = http.createServer(app);
console.log('HTTP serving on port 8080.');
httpServer.listen(8080);

try {
    var privateKey  = fs.readFileSync('certs/server.key', 'utf8');
    var certificate = fs.readFileSync('certs/server.crt', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    console.log('HTTPS serving on port 8443.');
    httpsServer.listen(8443);
} catch (error) {
    console.log('Invalid certificates or certificates not found: the server will only serve in HTTP.');
    console.log(error);
}