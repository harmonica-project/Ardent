var pg = require("pg")
const { v4: uuidv4 } = require('uuid');
const { DB_CONFIG } = require('../config');
const client = new pg.Client(DB_CONFIG);

client.connect();

module.exports = {
    deleteCategory: async categoryId => {
        try {
            await client.query("DELETE FROM categories_base WHERE id = $1", [categoryId]);
            
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
    storeCategory: async category => {
        const newCategoryId = uuidv4();
        try {
            await client.query(`
                INSERT INTO categories_base (id, label) VALUES ($1, $2)
            `, [newCategoryId, category.label])
            return {
                success: true,
                categoryId: newCategoryId
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
    modifyCategory: async category => {
        try {
            await client.query(`
            UPDATE categories_base SET label = $1 WHERE id = $2`, 
            [
                category.label,
                category.id
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
    getCategories: async () => {
        try {
            return await client.query("SELECT * FROM categories_base");
        }
        catch(err) {
            return err;
        }
    },
}