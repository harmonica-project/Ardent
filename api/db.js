const { query } = require("express");
var pg = require("pg")

// THOSE ARE DEFAULT LOGINS FOR TEST ONLY - NOT SUITABLE FOR PRODUCTION
const DB_HOST = 'localhost';
const DB_PORT = '5432'
const DB_USER = 'postgres';
const DB_PWD = 'root';
const DB_DATABASE = 'slr';

const client = new pg.Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PWD,
    port: DB_PORT
});

client.connect();

module.exports = {
    getArchitectures: async () => {
        try {
            return await client.query("SELECT * FROM architectures");
        }
        catch(err) {
            return err;
        }
    },
    getComponents: async () => {
        try {
            return await client.query("SELECT * FROM components");
        }
        catch(err) {
            return err;
        }
    },
    getComponentsNames: async () => {
        try {
            return await client.query("SELECT DISTINCT name FROM components");
        }
        catch(err) {
            return err;
        }
    },
    getArchitecture: async architectureId => {
        try {
            const components = await client.query("SELECT * FROM components WHERE architecture_id = $1", [architectureId]);
            const architecture = await client.query("SELECT * FROM architectures WHERE id = $1", [architectureId]);
            
            return {
                success: true,
                result: {
                    ...architecture["rows"][0],
                    components: components["rows"]
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
    getComponent: async componentId => {
        try {
            const component = await client.query("SELECT * FROM components WHERE id = $1", [componentId]);
            const properties = await client.query("SELECT * FROM properties WHERE component_id = $1", [componentId]);
            
            return {
                success: true,
                result: {
                    ...component["rows"][0],
                    properties: properties["rows"]
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
    storeArchitecture: async architecture => {
        try {
            const foundArchitecture = await client.query("SELECT * FROM architectures WHERE id = $1 OR paper = $2", [architecture.id, architecture.paper]);
            if(foundArchitecture["rows"].length === 0) {
                const result = await client.query("INSERT INTO architectures VALUES ($1, $2, $3, $4)", [architecture.id, architecture.paper, architecture.description, architecture.doneBy])
                return {success: true}
            }
            else {
                console.log('Already exists')
                return {
                    success: false,
                    errorMsg: 'Architecture already exists.'
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
    }
}