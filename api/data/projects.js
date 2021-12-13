var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    getProjectArchitectures: async (projectUrl) => {
        try {
            return await client.query("SELECT * FROM architectures WHERE project_url = $1", [projectUrl]);
        }
        catch(err) {
            return err;
        }
    },
    getProjectPapers: async (projectUrl) => {
        try {
            var paperResult = (await client.query('SELECT * from papers WHERE project_url = $1', [projectUrl]))["rows"];

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
    getProjectQuestions: async (projectUrl) => {
        try {
            return await client.query(`
                SELECT id, title, content, questions.username, date, first_name, last_name, role, object_id, object_type, status FROM questions
                LEFT JOIN users on questions.username = users.username
                WHERE project_url = $1
            `, [projectUrl]);
        }
        catch(err) {
            return err;
        }
    },
    getProjectBaseComponents: async (projectUrl) => {
        try {
            return await client.query("SELECT * FROM components_base WHERE project_url = $1", [projectUrl]);
        }
        catch(err) {
            return err;
        }
    },
    storeProject: async project => {
        try {
            const foundProject = await client.query("SELECT * FROM projects WHERE url = $1", [project.url]);
            if(foundProject["rows"].length === 0) {
                await client.query(`
                    INSERT INTO projects (url, name, description) 
                    VALUES ($1, $2, $3)`, 
                    [
                        project.url, 
                        project.name, 
                        project.description, 
                    ]
                );
                return { success: true }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'Project already exists, or a project already has its url.'
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
    addUserToProject: async (username, url, isAdmin) => {
        const newRelationId = uuidv4();
        await client.query(`
            INSERT INTO project_roles (id, url, username, is_admin) 
            VALUES ($1, $2, $3, $4)`, 
            [
                newRelationId,
                url, 
                username, 
                isAdmin, 
            ]
        );
        return { success: true }
    },
    deleteProject: async (projectUrl, username) => {
        const foundProject = await client.query("SELECT * FROM project_roles WHERE url = $1 AND username = $2", [projectUrl, username]);
            if(foundProject["rows"].length !== 0 && foundProject["rows"][0].is_admin === true) {
                await client.query(`
                        DELETE from projects WHERE url = $1
                    `, 
                    [projectUrl]
                );
                return { success: true }
            }
            else {
                return {
                    success: false,
                    errorMsg: 'The user is not an admin of the project, deletion is impossible.'
                };
            }
    }
}