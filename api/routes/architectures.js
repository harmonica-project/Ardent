const express = require('express'), router = express.Router();
const db = require('../db');
const { authorizedOnly } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .get('/', authorizedOnly, (req, res) => {
    db.getArchitectures().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/:id', authorizedOnly, (req, res) => {
    var id = req.params.id;
    db.getArchitecture(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/', authorizedOnly, (req, res) => {
    const newArchitecture = req.body;
    if(newArchitecture.name && newArchitecture.paper_id && newArchitecture.reader_description) {
        db.storeArchitecture(newArchitecture).then((parsedResult) => {
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
    db.deleteArchitecture(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .put('/:id', authorizedOnly, (req, res) => {
    const newArchitecture = req.body;
    if(newArchitecture.reader_description && newArchitecture.name && newArchitecture.id) {
        db.modifyArchitecture(newArchitecture).then((parsedResult) => {
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

module.exports = router;