var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    getComponentsInstances: async () => {
        try {
            return await client.query("SELECT * FROM components_instances");
        }
        catch(err) {
            return err;
        }
    },
    getFullComponents: async () => {
        try {
            const baseComponents = (await client.query("SELECT c.*, b.label FROM components_base as c LEFT JOIN categories_base as b ON c.category_id = b.id"))["rows"];

            if (baseComponents) {
                for (let i = 0; i < baseComponents.length; i++) {
                    const instanceComponents = (await client.query(`
                        SELECT c.*, a.name as architecture_name, p.name as paper_name FROM components_instances as c
                        JOIN architectures as a on c.architecture_id = a.id
                        JOIN papers as p on a.paper_id = p.id
                        WHERE component_base_id = $1`, 
                    [baseComponents[i].id]))["rows"];
                    const baseProperties = (await client.query("SELECT * FROM properties_base WHERE component_base_id = $1", [baseComponents[i].id]))["rows"];

                    baseComponents[i]["instances"] = instanceComponents;
                    baseComponents[i]["properties"] = baseProperties;
                }

                return { success: true, result: baseComponents };
            } else {
                return { success: false };
            }
        }
        catch(err) {
            console.log(err);
            return err;
        }
    },
    getBaseComponents: async () => {
        try {
            return await client.query("SELECT c.*, b.label FROM components_base as c LEFT JOIN categories_base as b ON c.category_id = b.id");
        }
        catch(err) {
            return err;
        }
    },
    getComponentInstance: async componentId => {
        try {
            const component = await client.query("SELECT * FROM components_instances WHERE id = $1", [componentId]);
            const properties = await client.query("SELECT * FROM properties_instances WHERE component_instance_id = $1", [componentId]);
            const connections = await client.query("SELECT * FROM connections WHERE first_component = $1 OR second_component = $1", [componentId]);
            
            return {
                success: true,
                result: {
                    ...component["rows"][0],
                    properties: properties["rows"],
                    connections: connections["rows"]
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
    deleteBaseComponent: async componentId => {
        try {
            await client.query("DELETE FROM components_base WHERE id = $1", [componentId]);
            
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
    deleteComponentInstance: async componentId => {
        try {
            await client.query("DELETE FROM components_instances WHERE id = $1", [componentId]);
            
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
    storeComponentInstance: async component => {
        const newComponentId = uuidv4();
        try {
            await client.query("INSERT INTO components_instances (id, name, architecture_id, reader_description, author_description, component_base_id) VALUES ($1, $2, $3, $4, $5, $6)", [newComponentId, component.name, component.architecture_id, component.reader_description, component.author_description, component.component_base_id])
            return {success: true, componentId: newComponentId};
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    modifyComponentInstance: async component => {
        try {
            await client.query("UPDATE components_instances SET (name, architecture_id, reader_description, author_description, component_base_id) = ($1, $2, $3, $4, $5) WHERE id = $6", [component.name, component.architecture_id, component.reader_description, component.author_description, component.component_base_id, component.id])
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
    storeComponentBase: async component => {
        const newComponentId = uuidv4();
        try {
            await client.query("INSERT INTO components_base VALUES ($1, $2, $3)", [newComponentId, component.name, component.base_description])
            return {success: true, componentId: newComponentId};
        }
        catch(err) {
            console.log('error: ' + err)
            return {
                success: false,
                errorMsg: 'Failed connexion to DB: ' + err
            };
        }
    },
    modifyComponentBase: async component => {
        try {
            await client.query("UPDATE components_base SET (name, base_description) = ($1, $2) WHERE id = $3", [component.name, component.base_description, component.id])
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