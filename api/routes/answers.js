const express = require('express'), router = express.Router();
const db = require('../data/answers');
const { authorizedOnly, verifyClaimIdentity } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .post('/', authorizedOnly, (req, res) => {
    if (verifyClaimIdentity(req.body.username, req)) {
      db.storeAnswer(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
      });
    } else {
      res.status(401).send({
        success: false,
        errorMsg: 'User posting the answer is not the same as the one authentified.'
      });
    }
  })
  .get('/:questionId', authorizedOnly, (req, res) => {
    db.getAnswers(req.params.questionId).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    });
  })
  .delete('/:id', authorizedOnly, (req, res) => {
    db.deleteAnswer(req.params.id).then((parsedResult) => {
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(parsedResult);
    });
  });

module.exports = router;