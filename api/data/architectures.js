var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

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
    getArchitecture: async architectureId => {
        try {
            const components = await client.query("SELECT * FROM components_instances WHERE architecture_id = $1", [architectureId]);
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
    cloneArchitecture: async (architectureId, paperId) => {
        try {
            const newArchitectureId = uuidv4();
            const architecture = (await client.query("SELECT * FROM architectures WHERE id = $1", [architectureId]))["rows"];
            if (architecture.length) {
                await client.query(
                    `INSERT INTO architectures (id, name, reader_description, paper_id, author_description) 
                    VALUES ($1, $2, $3, $4, $5)`, [newArchitectureId, architecture[0].name, architecture[0].reader_description, paperId, architecture[0].author_description]
                );
                const components = (await client.query("SELECT * FROM components_instances WHERE architecture_id = $1", [architectureId]))["rows"];

                for (let i = 0; i < components.length; i++) {
                    let component = components[i];
                    let newComponentId = uuidv4();

                    await client.query(
                        `INSERT INTO components_instances (id, name, architecture_id, reader_description, author_description, component_base_id)
                        VALUES ($1, $2, $3, $4, $5, $6)`, 
                        [
                            newComponentId, 
                            component.name, 
                            newArchitectureId, 
                            component.reader_description, 
                            component.author_description, 
                            component.component_base_id
                        ]
                    );
                }

                return {
                    success: true,
                    architectureId: newArchitectureId
                }
            }

            return {
                success: true,
                errorMsg: 'Architecture not found.'
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
    storeArchitecture: async architecture => {
        try {
            const newArchitectureId = uuidv4();
            await client.query("INSERT INTO architectures (id, name, reader_description, paper_id, author_description) VALUES ($1, $2, $3, $4, $5)", [newArchitectureId, architecture.name, architecture.reader_description, architecture.paper_id, architecture.author_description])
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
    modifyArchitecture: async architecture => {
        try {
            await client.query("UPDATE architectures SET (name, reader_description, author_description) = ($1, $2, $3) WHERE id = $4", [architecture.name, architecture.reader_description, architecture.author_description, architecture.id])
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