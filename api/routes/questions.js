const express = require('express'), router = express.Router();
const db = require('../data/questions');
const { authorizedOnly, verifyClaimIdentity, verifyClaimAdmin } = require('../utils/authorization');
const { parseDBResults, intErrResp } = require('../utils/helpers');

router
  .post('/', authorizedOnly, async (req, res) => {
    if (await verifyClaimIdentity(req.body.username, req)) {
      db.storeQuestion(req.body).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(intErrResp());
      })
    } else {
      res.status(401).send({
        success: false,
        errorMsg: 'User posting the answer is not the same as the one authentified.'
      });
    }
  })
  .put('/:id/close', authorizedOnly, async (req, res) => {
    const questionRes = parseDBResults(await db.getQuestion(req.params.id));
    if (
      !(await verifyClaimIdentity(questionRes.result[0].username, req)) &&
      !(await verifyClaimAdmin(req)) 
    ) {
      res.status(401).send({
        success: false,
        errorMsg: 'User deleting the answer is not the same as the one authentified or not admin.'
      });
      return;
    }

    db.markAsClosed(req.params.id).then((queryResult) => {
      const parsedResult = parseDBResults(queryResult);
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(intErrResp());
    })
  });

module.exports = router;