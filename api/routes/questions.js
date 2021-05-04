const express = require('express'), router = express.Router();
const db = require('../data/questions');
const { authorizedOnly, verifyClaimIdentity } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .post('/', authorizedOnly, (req, res) => {
    db.storeQuestion(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/', authorizedOnly, (req, res) => {
    db.getQuestions().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  });

module.exports = router;