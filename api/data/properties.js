var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    getPropertiesNames: async componentName => {
        try {
            if(componentName) {
                return await client.query("SELECT DISTINCT key from properties_instances JOIN components_instances on (properties_instances.component_instance_id = components_instances.id) WHERE components_instances.name = $1", [componentName]);
            }
            else {
                return await client.query("SELECT DISTINCT key from properties_instances", [componentName]);
            }
        }
        catch(err) {
            return err;
        }
    },
    getPropertyValues: async propertyKey => {
        try {
            return await client.query("SELECT value from properties_instances WHERE key = $1", [propertyKey]);
        }
        catch(err) {
            return err;
        }
    },
    deleteProperty: async propertyId => {
        try {
            await client.query("DELETE FROM properties_instances WHERE id = $1", [propertyId]);
            
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
    deleteBaseProperty: async propertyId => {
        try {
            await client.query("DELETE FROM properties_base WHERE id = $1", [propertyId]);
            
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
            const propertyId = uuidv4();
            const foundProperties = await client.query("SELECT * FROM properties_instances WHERE key = $1 AND component_instance_id = $2", [property.key, property.component_id]);
            if(foundProperties["rows"].length === 0) {
                await client.query(
                    `INSERT INTO properties_instances(id, key, value, component_instance_id, category) 
                    VALUES ($1, $2, $3, $4, $5)`, [propertyId, property.key, property.value, property.component_id, property.category]
                )
                return {
                    success: true,
                    propertyId
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
    storeBaseProperty: async property => {
        try {
            const propertyId = uuidv4();
            const foundProperties = await client.query("SELECT * FROM properties_base WHERE key = $1 AND component_base_id = $2", [property.key, property.component_base_id]);
            if(foundProperties["rows"].length === 0) {
                await client.query(
                    `INSERT INTO properties_base(id, key, component_base_id, category) 
                    VALUES ($1, $2, $3, $4)`, [propertyId, property.key, property.component_base_id, property.category]
                )
                return {
                    success: true,
                    propertyId
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
    modifyProperty: async property => {
        try {
            await client.query(`
            UPDATE properties_instances SET (key, value, category) =
            ($1, $2, $3) WHERE id = $4`, 
            [
                property.key, 
                property.value, 
                property.category,
                property.id
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
    },
    modifyBaseProperty: async property => {
        try {
            await client.query(`
            UPDATE properties_base SET (key, category) =
            ($1, $2) WHERE id = $3`, 
            [
                property.key, 
                property.category, 
                property.id
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