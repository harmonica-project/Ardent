var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    storeAnswer: async answer => {
        const newAnswerId = uuidv4();
        try {
            await client.query(`
                INSERT INTO answers (id, question_id, content, username, date) 
                VALUES ($1, $2, $3, $4, $5)
            `, [newAnswerId, answer.question_id, answer.content, answer.username, new Date().toISOString()])
            return {
                success: true,
                answerId: newAnswerId
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
    getAnswers: async (questionId) => {
        try {
            return await client.query(`
                SELECT id, question_id, content, answers.username, date, first_name, last_name, role FROM answers
                LEFT JOIN users on answers.username = users.username
                WHERE question_id = $1
            `, [questionId]);
        }
        catch(err) {
            return err;
        }
    },
    getAnswer: async (answerId) => {
        try {
            return await client.query(`
                SELECT id, question_id, content, answers.username, date, first_name, last_name, role FROM answers
                LEFT JOIN users on answers.username = users.username
                WHERE id = $1
            `, [answerId]);
        }
        catch(err) {
            return err;
        }
    },
    deleteAnswer: async (answerId) => {
      try {
        await client.query("DELETE FROM answers WHERE id = $1", [answerId]);
        
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
    }
}