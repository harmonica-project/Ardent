const express = require('express'), router = express.Router();
const db = require('../data/properties');
const { authorizedOnly } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .post('/', authorizedOnly, (req, res) => {
    db.storeProperty(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .delete('/:id', authorizedOnly, (req, res) => {
    db.deleteProperty(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/names/:cname', authorizedOnly, (req, res) => {
    var cname = req.params.cname;
    db.getPropertiesNames(cname).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/names', authorizedOnly, (req, res) => {
    db.getPropertiesNames().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/values/:pkey', authorizedOnly, (req, res) => {
    var pkey = req.params.pkey;
    db.getPropertyValues(pkey).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })

module.exports = router;