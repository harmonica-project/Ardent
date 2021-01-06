const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './uploads/' }).single("xlsArchitectures");
const xlsxj = require("xlsx-to-json");
const { v4: uuidv4 } = require('uuid');
const { storeArchitecture } = require('./db');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
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

app.post('/architecture', (req, res) => {
    db.storeArchitecture(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.post('/property', (req, res) => {
    db.storeProperty(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.post('/connection', (req, res) => {
    db.storeConnection(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/architecture/:id', (req, res) => {
    db.deleteArchitecture(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/property/:id', (req, res) => {
    db.deleteProperty(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.delete('/connection/:id', (req, res) => {
    db.deleteConnection(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.post('/component', (req, res) => {
    db.storeComponent(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.post('/xls', async (req, res) => {
    await upload(req, res, async (err) => {
        try {
            await xlsxj({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //we don't need output
            }, async (err, result) => {
                if(err) {
                    res.status(500).send({
                        success: false,
                        errorMsg: "Conversion failed: " + e
                    });
                }
                
                var storeSuccessCounter = 0;
                
                for(var i = 0; i < result.length; i++) {
                    var storeResult = await storeArchitecture({
                        id: uuidv4(),
                        paper: result[i].title,
                        description: result[i].abstract,
                        doneBy: 0
                    })

                    if(storeResult["success"]) storeSuccessCounter++;
                }

                res.status(200).send({
                    success: true,
                    nbSuccessAdding: storeSuccessCounter,
                    nbFailedAdding: (result.length - storeSuccessCounter)
                });
            });
        } catch (e){
            console.log(e)
            res.status(500).send({
                success: false,
                errorMsg: "Conversion failed: " + e
            });
        }

        res.status(200)
    })
});

app.delete('/component/:id', (req, res) => {
    db.deleteComponent(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/components', (req, res) => {
    db.getComponents().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/components_names', (req, res) => {
    db.getComponentsNames().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/properties_names/:cname', (req, res) => {
    var cname = req.params.cname;
    db.getPropertiesNames(cname).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/properties_names/', (req, res) => {
    db.getPropertiesNames().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
});

app.get('/properties_values/:pkey', (req, res) => {
    var pkey = req.params.pkey;
    db.getPropertyValues(pkey).then((queryResult) => {
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