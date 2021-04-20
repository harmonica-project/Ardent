var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    getPapers: async () => {
        try {
            var paperResult = (await client.query('SELECT * from papers'))["rows"];

            for (let i = 0; i < paperResult.length; i++) {
                var architectureResult = (await client.query('SELECT * from architectures WHERE paper_id = $1', [paperResult[i].id]))["rows"];
                paperResult[i]["architectures"] = architectureResult;
            }

            return {
                success: true,
                result: paperResult
            };
        }
        catch(err) {
            console.log('error: ' + err);
            return {
                success: false,
                errorMsg: 'Request failed: ' + err 
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
    paperExists: async name => {
        try {
            const foundPaper = await client.query("SELECT * FROM papers WHERE name = $1", [name]);
            return { success: true, found: foundPaper["rows"].length !== 0 }
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