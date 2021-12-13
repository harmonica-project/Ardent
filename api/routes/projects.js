const express = require('express'), router = express.Router();
const db = require('../data/projects');
const { authorizedOnly, verifyClaimIdentity } = require('../utils/authorization');
const { parseDBResults, intErrResp } = require('../utils/helpers');

router
  .get('/:projectUrl/papers', authorizedOnly, (req, res) => {
    var projectUrl = req.params.projectUrl;
    db.getProjectPapers(projectUrl).then(parsedResult => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/:projectUrl/architectures', authorizedOnly, (req, res) => {
    const projectUrl = req.params.projectUrl;
    db.getProjectArchitectures(projectUrl).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/:projectUrl/questions', authorizedOnly, (req, res) => {
    const projectUrl = req.params.projectUrl;
    db.getProjectQuestions(projectUrl).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(intErrResp());
    })
  })
  .get('/:projectUrl/components/bases', authorizedOnly, (req, res) => {
    const projectUrl = req.params.projectUrl;
    db.getProjectBaseComponents(projectUrl).then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/', authorizedOnly, async (req, res) => {
    if (await verifyClaimIdentity(req.body.username, req)) {
      const newProject = req.body;
      if(newProject.name && newProject.url) {
          db.storeProject(newProject).then((parsedResult) => {
              if(parsedResult.success) {
                db.addUserToProject(req.body.username, req.body.url, true).then((parsedResult) => {
                  if(parsedResult.success) res.status(200).send(parsedResult);
                  else res.status(500).send(parsedResult);
                });
              }
              else res.status(500).send(parsedResult);
          })
      }
      else {
          res.status(500).send({
              success: false,
              errorMsg: "Missing fields."
          })
      }
    } else {
      res.status(401).send({
        success: false,
        errorMsg: 'User saving the project is not the same as the one authentified.'
      });
    }
  });

module.exports = router;