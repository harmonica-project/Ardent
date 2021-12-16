const express = require('express'), router = express.Router();
const db = require('../data/projects');
const { authorizedOnly, isConcernedUser, isProjectAdmin } = require('../utils/authorization');
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
  .delete('/:url', isProjectAdmin('params'), (req, res) => {
    db.deleteProject(req.params.url).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .post('/', isConcernedUser('body'), async (req, res) => {
    const newProject = req.body;
    if(newProject.name && newProject.url) {
        const projectParsedResult = await db.storeProject(newProject);
        if(projectParsedResult.success) {
          let error = false;

          for (let i in newProject.users) {
            let roleParsedResult = await db.addUserToProject(newProject.users[i].username, req.body.url, newProject.users[i].is_admin);
            if(!roleParsedResult.success) error = true;
          }

          if(error) res.status(500).send({
            success: false,
            errorMsg: 'The project has been created, but some user roles were not created (probably duplicates).'
          });
          else res.status(200).send({ success: true });
        }
        else res.status(500).send(projectParsedResult);
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })
  .put('/:url', isProjectAdmin('params'), async (req, res) => {
    const newProject = req.body;
    const oldUrl = req.params.url;
    if(newProject.name && newProject.url) {
        const projectParsedResult = await db.editProject(oldUrl, newProject);
        if(projectParsedResult.success) {
          const userParsedResult = await db.changeUsersInProject(newProject);
          if (userParsedResult.success) res.status(200).send({ success: true });
          else res.status(500).send({
            success: false,
            errorMsg: 'The project has been modified, but the role modification failed (probably because no admin is present in the new selection of users).'
          });
        }
        else res.status(500).send(projectParsedResult);
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  });;

module.exports = router;