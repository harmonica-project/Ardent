var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    deleteConnection: async connectionId => {
        try {
            await client.query("DELETE FROM connections WHERE id = $1", [connectionId]);
            
            return {
                success: true
            }
        }
        catch(err) {
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    storeConnection: async connection => {
        const newConnectionId = uuidv4();
        try {
            const foundConnections = await client.query("SELECT * FROM connections WHERE (first_component = $1 AND second_component = $2) OR (first_component = $2 AND second_component = $1)", [connection.first_component, connection.second_component]);
            if(foundConnections["rows"].length === 0) {
                await client.query("INSERT INTO connections VALUES ($1, $2, $3)", [newConnectionId, connection.first_component, connection.second_component])
                return {
                    success: true,
                    connectionId: newConnectionId
                }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'Property already exists for this component.'
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
    modifyConnection: async connection => {
        try {
            await client.query(`
            UPDATE connections SET (first_component, second_component) =
            ($1, $2) WHERE id = $3`, 
            [
                connection.first_component, 
                connection.second_component, 
                connection.id
            ])
            return {success: true};
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