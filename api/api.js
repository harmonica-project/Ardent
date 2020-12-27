const express = require('express')
const app = express()

// THOSE ARE DEFAULT LOGINS FOR TEST ONLY - NOT SUITABLE FOR PRODUCTION
const DB_URL = 'localhost:5432';
const DB_USER = 'postgres';
const DB_PWD = 'root';


app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})