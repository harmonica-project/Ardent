var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

const addUserToProject = async (username, url, isAdmin) => {
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
};

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
    editProject: async (oldUrl, project) => {
        try {
            const foundProject = await client.query("SELECT * FROM projects WHERE url = $1", [oldUrl]);
            if(foundProject["rows"].length !== 0) {
                await client.query(`
                    UPDATE projects set (url, name, description) = ($1, $2, $3) WHERE url = $4`, 
                    [
                        project.url, 
                        project.name, 
                        project.description, 
                        oldUrl
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
    addUserToProject,
    changeUsersInProject: async (project) => {
        const atleastOneAdmin = project.users.some((user) => user.is_admin);
        if (atleastOneAdmin) {
            await client.query('DELETE from project_roles WHERE url = $1', [project.url]);
            let failed = false;
            
            for (let i in project.users) {
                let user = project.users[i];
                let result = await addUserToProject(user.username, project.url, user.is_admin);
                if (!result.success) failed = true;
            }

            return { success: !failed };
        } else {
            return {
                success: false,
                errorMsg: 'Error: there is no admin in the new set of users for the project.'
            };
        }
    },
    deleteProject: async (projectUrl) => {
        await client.query(`
                DELETE from projects WHERE url = $1
            `, 
            [projectUrl]
        );
        return { success: true };
    },
    isProjectAdmin: async (projectUrl, username) => {
        const foundProject = await client.query("SELECT * FROM project_roles WHERE url = $1 AND username = $2", [projectUrl, username]);
        if (foundProject["rows"].length !== 0 && foundProject["rows"][0].is_admin === true) return true;
        return false;
    }
}