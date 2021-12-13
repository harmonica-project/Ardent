const express = require('express'), router = express.Router();
const db = require('../data/components');
const { authorizedOnly } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .get('/', authorizedOnly, (req, res) => {
    db.getFullComponents().then(parsedResult => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .delete('/bases/:id', authorizedOnly, (req, res) => {
    db.deleteBaseComponent(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/instances', authorizedOnly, (req, res) => {
    db.storeComponentInstance(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .put('/instances/:id', authorizedOnly, (req, res) => {
    const newComponent = req.body;
    if(newComponent.name.length > 0 && newComponent.architecture_id && newComponent.id) {
        db.modifyComponentInstance(newComponent).then((parsedResult) => {
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
  .post('/bases', authorizedOnly, (req, res) => {
    db.storeComponentBase(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .put('/bases/:id', authorizedOnly, (req, res) => {
    const newComponent = req.body;
    if(newComponent.name.length > 0 && newComponent.id) {
        db.modifyComponentBase(newComponent).then((parsedResult) => {
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
  .delete('/instances/:id', authorizedOnly, (req, res) => {
    db.deleteComponentInstance(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/instances/:id', authorizedOnly, (req, res) => {
    var id = req.params.id;
    db.getComponentInstance(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })

module.exports = router;