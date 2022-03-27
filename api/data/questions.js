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
                INSERT INTO questions (id, title, content, username, date, object_id, object_type, status, project_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8)
            `, [newQuestionId, question.title, question.content, question.username, new Date().toISOString(), question.object_id, question.object_type, question.project_url])
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
    getQuestion: async (questionId) => {
        try {
            return await client.query(`
                SELECT id, title, content, questions.username, date, first_name, last_name, role, object_id, object_type, status FROM questions
                LEFT JOIN users on questions.username = users.username
                WHERE questions.id = $1
            `, [questionId]);
        }
        catch(err) {
            return err;
        }
    },
    markAsClosed: async (questionId) => {
        try {
            return await client.query(`
                UPDATE questions
                SET status = 2
                WHERE id = $1
            `, [questionId]);
        }
        catch(err) {
            return err;
        }
    },
    maskAsAnswered: async (questionId) => {
        try {
            return await client.query(`
                UPDATE questions
                SET status = 1
                WHERE id = $1
            `, [questionId]);
        }
        catch(err) {
            return err;
        }
    }
}