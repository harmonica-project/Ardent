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
  .post('/base', authorizedOnly, (req, res) => {
    db.storeBaseProperty(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(400).send(parsedResult);
    })
  })
  .put('/', authorizedOnly, (req, res) => {
    db.modifyProperty(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .put('/base', authorizedOnly, (req, res) => {
    db.modifyBaseProperty(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .delete('/base/:id', authorizedOnly, (req, res) => {
    db.deleteBaseProperty(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/base/:id', authorizedOnly, (req, res) => {
    db.getBaseComponentProperties(req.params.id).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
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
  .get('/instances/:componentId', authorizedOnly, (req, res) => {
    var id = req.params.componentId;
    db.getInstancePropertiesFromComponent(id).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
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

module.exports = router;