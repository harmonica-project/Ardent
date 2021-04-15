var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    getPropertiesNames: async componentName => {
        try {
            if(componentName) {
                return await client.query("SELECT DISTINCT key from properties JOIN components_instances on (properties.component_id = components_instances.id) WHERE components_instances.name = $1", [componentName]);
            }
            else {
                return await client.query("SELECT DISTINCT key from properties", [componentName]);
            }
        }
        catch(err) {
            return err;
        }
    },
    getPropertyValues: async propertyKey => {
        try {
            return await client.query("SELECT value from properties WHERE key = $1", [propertyKey]);
        }
        catch(err) {
            return err;
        }
    },
    deleteProperty: async propertyId => {
        try {
            await client.query("DELETE FROM properties WHERE id = $1", [propertyId]);
            
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
    storeProperty: async property => {
        try {
            const foundProperties = await client.query("SELECT * FROM properties WHERE key = $1 AND component_id = $2", [property.key, property.component_id]);
            if(foundProperties["rows"].length === 0) {
                await client.query("INSERT INTO properties VALUES ($1, $2, $3, $4)", [property.id, property.key, property.value, property.component_id])
                return {
                    success: true
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
    }
}