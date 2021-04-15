const express = require('express'), router = express.Router();
const db = require('../data/connections');
const { authorizedOnly } = require('../utils/authorization');

router
  .post('/connection', authorizedOnly, (req, res) => {
    db.storeConnection(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .delete('/connection/:id', authorizedOnly, (req, res) => {
    db.deleteConnection(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })

module.exports = router;