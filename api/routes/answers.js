const express = require('express'), router = express.Router();
const answersDB = require('../data/answers');
const questionsDB = require('../data/questions');
const { authorizedOnly, isConcernedUser, isItemOwnerOrAdmin } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

router
  .post('/', isConcernedUser('body'), async (req, res) => {
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
  .delete('/:id', isItemOwnerOrAdmin(answersDB.getAnswer, 'params'), async (req, res) => {
    answersDB.deleteAnswer(req.params.id).then((parsedResult) => {
      if(parsedResult.success) res.status(200).send(parsedResult);
      else res.status(500).send(parsedResult);
    });
  });

module.exports = router;