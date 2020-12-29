const express = require('express');
const app = express();
const db = require('./db');

const parseDBResults = res => {
    if(res["rows"]) {
        return {
            success: true,
            result: res["rows"]
        }
    }
    else {
        return {
            success: false,
            errorMsg: "Failed connexion to DB" + JSON.stringify(res)
        }
    }
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/architectures', (req, res) => {
    db.getArchitectures().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/architecture/:id', (req, res) => {
    var id = req.params.id;
    db.getArchitecture(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/component/:id', (req, res) => {
    var id = req.params.id;
    db.getComponent(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.listen(8080, () => {
    console.log("Listening on port 8080.")
})