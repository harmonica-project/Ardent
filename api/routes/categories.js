const express = require('express'), router = express.Router();
const db = require('../data/categories');
const { authorizedOnly } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .get('/', authorizedOnly, (req, res) => {
    db.getCategories(req.body).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/', authorizedOnly, (req, res) => {
    db.storeCategory(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .delete('/:id', authorizedOnly, (req, res) => {
    db.deleteCategory(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .put('/', authorizedOnly, (req, res) => {
    db.modifyCategory(req.body).then((parsedResult) => {
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(parsedResult);
    })
  });

module.exports = router;