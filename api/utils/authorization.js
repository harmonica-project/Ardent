const db = require('../db');
var nJwt = require('njwt');
var { SIGN_KEY } = require('../config');

module.exports = {
    authorizedOnly: (req, res, next) => {
        const authHeader = req.headers['authorization'];

        try {
            const token = authHeader && authHeader.split(' ')[1];
            const verifiedToken = nJwt.verify(token, SIGN_KEY);
            db.getUser(verifiedToken.body.sub).then((parsedResult) => {
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
    },
    verifyClaimIdentity: async (username, req) => {
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
    },
    verifyClaimAdmin: async (req) => {
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
    }
}