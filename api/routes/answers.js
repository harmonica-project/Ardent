const express = require('express'), router = express.Router();
const answersDB = require('../data/answers');
const questionsDB = require('../data/questions');
const { authorizedOnly, verifyClaimIdentity, verifyClaimAdmin } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .post('/', authorizedOnly, async (req, res) => {
    if (!(await verifyClaimIdentity(req.body.username, req))) {
      res.status(401).send({
        success: false,
        errorMsg: 'User posting the answer is not the same as the one authentified.'
      });
      return;
    }

    const questionRes = parseDBResults(await questionsDB.getQuestion(req.body.question_id));
    if (parseInt(questionRes.result[0].status) === 2) {
      res.status(400).send({
        success: false,
        errorMsg: 'Question is closed.'
      });
      return;
    }

    const parsedResult = await answersDB.storeAnswer(req.body);
    const parsedAnswResult = parseDBResults(await questionsDB.maskAsAnswered(req.body.question_id));
    if(!parsedResult.success || !parsedAnswResult.success) {
      res.status(500).send(parsedResult);
      return;
    }

    res.status(200).send(parsedResult);
  })
  .get('/:questionId', authorizedOnly, (req, res) => {
    answersDB.getAnswers(req.params.questionId).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    });
  })
  .delete('/:id', authorizedOnly, async (req, res) => {
    const answerRes = parseDBResults(await answersDB.getAnswer(req.params.id));
    if (
      !(await verifyClaimIdentity(answerRes.result[0].username, req)) &&
      !(await verifyClaimAdmin(req)) 
    ) {
      res.status(401).send({
        success: false,
        errorMsg: 'User deleting the answer is not the same as the one authentified or not admin.'
      });
      return;
    }
    
    answersDB.deleteAnswer(req.params.id).then((parsedResult) => {
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(parsedResult);
    });
  });

module.exports = router;