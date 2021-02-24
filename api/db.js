var pg = require("pg")
const { v4: uuidv4 } = require('uuid');

// THOSE ARE DEFAULT LOGINS FOR TEST ONLY - NOT SUITABLE FOR PRODUCTION
const DB_HOST = '<DB_HOST>';
const DB_PORT = '<DB_PORT>'
const DB_USER = '<DB_USER>';
const DB_PWD = '<DB_PWD>';
const DB_DATABASE = '<DB_DATABASE>';

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
    getPapers: async () => {
        try {
            var queryResult = await client.query(
                `SELECT papers.*, array_agg(architectures.id || ';' || architectures.name || ';' || architectures.description) architectures 
                FROM papers 
                FULL JOIN architectures on papers.id = architectures.paper_id 
                GROUP BY papers.id`
            );

            var results = queryResult["rows"];

            for(var i = 0; i < results.length; i++) {
                if(results[i].architectures[0] != null) {
                    for(var j = 0; j < results[i].architectures.length; j++) {
                        var content = results[i].architectures[j].split(';');
                        results[i].architectures[j] = {
                            id: content[0],
                            name: content[1],
                            description: content[2],
                            paper_id: results[i].id
                        }
                    }
                }
                else {
                    results[i].architectures = []
                }
            }

            return {
                success: true,
                result: results
            };
        }
        catch(err) {
            console.log(err);
            return {
                success: false,
                errorMsg: 'Request failed: ' + err 
            };
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
            return await client.query("SELECT DISTINCT name, id FROM components");
        }
        catch(err) {
            return err;
        }
    },
    getPropertiesNames: async componentName => {
        try {
            if(componentName) {
                return await client.query("SELECT DISTINCT key from properties JOIN components on (properties.component_id = components.id) WHERE components.name = $1", [componentName]);
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
    deleteArchitecture: async architectureId => {
        try {
            await client.query("DELETE FROM architectures WHERE id = $1", [architectureId]);
            
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
    deletePaper: async paperId => {
        try {
            await client.query("DELETE FROM papers WHERE id = $1", [paperId]);
            
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
    storePaper: async paper => {
        const newPaperId = uuidv4();
        try {
            const foundPaper = await client.query("SELECT * FROM papers WHERE name = $1", [paper.name]);
            if(foundPaper["rows"].length === 0) {
                await client.query(`
                    INSERT INTO papers(id, name, doi, authors, paper_type, journal, added_by, updated_by, status, abstract, comments) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10)`, 
                    [
                        newPaperId, 
                        paper.name, 
                        paper.doi, 
                        paper.authors, 
                        paper.paper_type, 
                        paper.journal, 
                        paper.added_by,
                        paper.updated_by,
                        paper.abstract,
                        paper.comments
                    ]
                );
                return { success: true, paperId: newPaperId }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'Paper already exists, or a paper already has its name.'
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
    storeArchitecture: async architecture => {
        try {
            const newArchitectureId = uuidv4();
            await client.query("INSERT INTO architectures (id, name, description, paper_id) VALUES ($1, $2, $3, $4)", [newArchitectureId, architecture.name, architecture.description, architecture.paper_id])
            return {success: true, architectureId: newArchitectureId}
        }
        catch(err) {
            console.log('error: ' + err)
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
    },
    storeConnection: async connection => {
        try {
            const foundConnections = await client.query("SELECT * FROM connections WHERE (first_component = $1 AND second_component = $2) OR (first_component = $2 AND second_component = $1)", [connection.first_component, connection.second_component]);
            if(foundConnections["rows"].length === 0) {
                await client.query("INSERT INTO connections VALUES ($1, $2, $3)", [connection.id, connection.first_component, connection.second_component])
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
    },
    deleteComponent: async componentId => {
        try {
            await client.query("DELETE FROM components WHERE id = $1", [componentId]);
            
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
    storeComponent: async component => {
        try {
            await client.query("INSERT INTO components VALUES ($1, $2, $3, $4)", [component.id, component.name, component.architectureId, component.description])
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
    modifyComponent: async component => {
        try {
            await client.query("UPDATE components SET (name, architecture_id, description) = ($1, $2, $3) WHERE id = $4", [component.name, component.architectureId, component.description, component.id])
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
    modifyPaper: async paper => {
        try {
            await client.query(`
            UPDATE papers SET (name, doi, authors, paper_type, journal, updated_by, status, abstract, comments) =
            ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE id = $10`, 
            [
                paper.name, 
                paper.doi, 
                paper.authors, 
                paper.paper_type, 
                paper.journal, 
                paper.updated_by,
                paper.status,
                paper.abstract,
                paper.comments,
                paper.id
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
    modifyArchitecture: async architecture => {
        try {
            await client.query("UPDATE architectures SET (name, description) = ($1, $2) WHERE id = $3", [architecture.name, architecture.description, architecture.id])
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