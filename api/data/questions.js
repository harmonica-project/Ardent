var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    storeQuestion: async question => {
        const newQuestionId = uuidv4();
        try {
            await client.query(`
                INSERT INTO questions (id, title, content, username, date) 
                VALUES ($1, $2, $3, $4, $5)
            `, [newQuestionId, question.title, question.content, question.username, new Date().toISOString()])
            return {
                success: true,
                questionId: newQuestionId
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
    getQuestions: async () => {
        try {
            return await client.query(`
                SELECT id, title, content, questions.username, date, first_name, last_name, role FROM questions
                LEFT JOIN users on questions.username = users.username
            `);
        }
        catch(err) {
            return err;
        }
    },
}