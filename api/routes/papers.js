const express = require('express'), router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '../uploads/' }).single("xls");
const xlsxj = require("xlsx-to-json");
const db = require('../db');
const { authorizedOnly } = require('../utils/authorization');

router
  .get('/', authorizedOnly, (req, res) => {
    db.getPapers().then(parsedResult => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/', authorizedOnly, (req, res) => {
    const newPaper = req.body;
    if(newPaper.name && newPaper.authors && newPaper.added_by && newPaper.updated_by) {
        db.storePaper(newPaper).then((parsedResult) => {
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })
  .put('/:id', authorizedOnly, (req, res) => {
    const newPaper = req.body;
    if(newPaper.name && newPaper.name.length > 0 && newPaper.authors && newPaper.added_by && newPaper.updated_by) {
        db.modifyPaper(newPaper).then((parsedResult) => {
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })
  .delete('/:id', authorizedOnly, (req, res) => {
    db.deletePaper(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/xls', authorizedOnly, async (req, res) => {
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
                    if(result[i].title.length != 0 && result[i].abstract.length != 0) {
                        var storeResult = await storeArchitecture({
                            paper: result[i].title,
                            reader_description: result[i].abstract,
                            done_by: ""
                        })

                        if(storeResult["success"]) storeSuccessCounter++;
                    }
                }

                res.status(200).send({
                    success: true,
                    nbSuccessAdding: storeSuccessCounter,
                    nbFailedAdding: (result.length - storeSuccessCounter)
                });
            });
        } catch (e){
            res.status(500).send({
                success: false,
                errorMsg: "Conversion failed: " + e
            });
        }

        res.status(200)
    })
  });

module.exports = router;