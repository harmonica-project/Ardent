var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    getUser: async username => {
        try {
            const user = await client.query("SELECT * FROM users WHERE username = $1", [username]);
            if(user["rows"].length === 1) {
                return {
                    success: true,
                    result: user["rows"][0]
                }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'User not found.'
                }
            }
        }
        catch(err) {
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    getUsers: async () => {
        return await client.query("SELECT username, first_name, last_name, role, is_admin FROM users");
    },
    getUserProjects: async (username) => {
        try {
            return await client.query(`
                SELECT p.name, p.description, p.url, pr.is_admin FROM projects as p
                LEFT JOIN project_roles as pr on pr.url = p.url
                WHERE pr.username = $1
            `, [username]);
        }
        catch(err) {
            return err;
        }
    },
    createUser: async user => {
        try {
            const foundUser = await client.query("SELECT * FROM users WHERE username = $1", [user.username]);
            if(foundUser["rows"].length === 0) {
                await client.query(`
                    INSERT INTO users(username, first_name, last_name, role, is_admin, hash) 
                    VALUES ($1, $2, $3, $4, false, $5)`, 
                    [
                        user.username,
                        user.first_name,
                        user.last_name,
                        user.role,
                        user.hash
                    ]
                );
                return { success: true }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'User already exists.'
                };
            }
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    consumeInviteToken: async token => {
        try {
            const foundToken = (await client.query("SELECT * FROM invite_tokens WHERE token = $1", [token]))["rows"][0];
            if(foundToken && foundToken.token) {
                await client.query("DELETE FROM invite_tokens WHERE token = $1", [token]);
                return { success: true }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'Token does not exists or already used.'
                };
            }
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    changeUserPassword: async (username, password) => {
        try {
            await client.query("UPDATE users SET hash = $1 WHERE username = $2", [password, username]);
            return {success: true};
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    modifyUser: async user => {
        try {
            await client.query("UPDATE users SET (first_name, last_name, role) = ($1, $2, $3) WHERE username = $4", [user.first_name, user.last_name, user.role, user.username]);
            return {success: true};
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    storeInviteToken: async token => {
        try {
            await client.query("INSERT INTO invite_tokens VALUES ($1)", [token])
            return {success: true, result: token};
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    }
}