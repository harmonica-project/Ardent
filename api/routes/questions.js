const express = require('express'), router = express.Router();
const db = require('../data/questions');
const { isItemOwnerOrAdmin, isConcernedUser } = require('../utils/authorization');
const { parseDBResults, intErrResp } = require('../utils/helpers');

router
  .post('/', isConcernedUser('body'), async (req, res) => {
    db.storeQuestion(req.body).then((parsedResult) => {
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(intErrResp());
    });
  })
  .put('/:id/close', isItemOwnerOrAdmin(db.getQuestion, 'params'), async (req, res) => {
    db.markAsClosed(req.params.id).then((queryResult) => {
      const parsedResult = parseDBResults(queryResult);
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(intErrResp());
    })
  });

module.exports = router;