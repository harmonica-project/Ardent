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
            await client.query(`
                INSERT INTO connections (id, first_component, second_component, datatype, direction, name) 
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [newConnectionId, connection.first_component, connection.second_component, connection.datatype, connection.direction, connection.name])
            return {
                success: true,
                connectionId: newConnectionId
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
            UPDATE connections SET (first_component, second_component, datatype, direction, name) =
            ($1, $2, $3, $4, $5) WHERE id = $6`, 
            [
                connection.first_component, 
                connection.second_component, 
                connection.datatype,
                connection.direction,
                connection.name,
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