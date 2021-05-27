const express = require('express'), router = express.Router();
const archDB = require('../data/architectures');
const compDB = require('../data/components');
const { authorizedOnly } = require('../utils/authorization');
const { parseDBResults } = require('../utils/helpers');

function resolveComponentName(id, components) {
    for (let i = 0; i < components.length; i++) {
        if (components[i].id === id) return `${components[i].name} (${components[i].id.substring(0, 7)})`;
    }
    return `Unknown name (${components[i].id.substring(0, 7)})`;
};

router
  .get('/', authorizedOnly, (req, res) => {
    archDB.getArchitectures().then((queryResult) => {
        const parsedResult = parseDBResults(queryResult);
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/:id', authorizedOnly, (req, res) => {
    var id = req.params.id;
    archDB.getArchitecture(id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .get('/:id/graph', authorizedOnly, async (req, res) => {
    let id = req.params.id;
    let graph = "digraph {\n";
    let archConns = {};
    if(id) {
        const resArch = await archDB.getArchitecture(id);
        if (!resArch.result) return res.status(500).send({ success: false, errorMsg: "Server error." });
        for (let i = 0; i < resArch.result.components.length; i++) {
            let c = resArch.result.components[i];
            graph += `"${resolveComponentName(c.id, resArch.result.components)}"\n`;
            let fullComp = await compDB.getComponentInstance(c.id);
            if (!fullComp.result) return res.status(500).send({ success: false, errorMsg: "Server error." });
            fullComp.result.connections.forEach(c => { archConns[c.id] = c; });
        }
        
        Object.keys(archConns).forEach(key => {
            const label = (archConns[key].datatype ? archConns[key].datatype : "Any");

            switch (archConns[key].direction) {
                case 'bidirectional':
                    graph += `"${resolveComponentName(archConns[key].first_component, resArch.result.components)}"`;
                    graph += `-> "${resolveComponentName(archConns[key].second_component, resArch.result.components)}"`;
                    graph += `[dir=both${(label ? `, label="${label}"` : '')}]\n`;
                    break;

                case 'first-to-second':
                    graph += `"${resolveComponentName(archConns[key].first_component, resArch.result.components)}"`;
                    graph += `-> "${resolveComponentName(archConns[key].second_component, resArch.result.components)}"`;
                    graph += `${(label ? `[label="${label}"]` : '')}\n`;
                    break;

                case 'second-to-first':
                    graph += `"${resolveComponentName(archConns[key].second_component, resArch.result.components)}"`;
                    graph += `-> "${resolveComponentName(archConns[key].first_component, resArch.result.components)}"`;
                    graph += `${(label ? `[label="${label}"]` : '')}\n`;
                    break;
            }
        });
        graph += "}";
        res.status(200).send({
            success: true,
            result: graph
        });

    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })
  .post('/', authorizedOnly, (req, res) => {
    const newArchitecture = req.body;
    if(newArchitecture.name && newArchitecture.paper_id) {
        archDB.storeArchitecture(newArchitecture).then((parsedResult) => {
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })
  .post('/clone', authorizedOnly, (req, res) => {
    const architectureId = req.body.architectureId;
    const paperId = req.body.paperId;

    if(architectureId && paperId) {
        archDB.cloneArchitecture(architectureId, paperId).then((parsedResult) => {
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })
  .delete('/:id', authorizedOnly, (req, res) => {
    archDB.deleteArchitecture(req.params.id).then((parsedResult) => {
        if(parsedResult.success) res.status(200).send(parsedResult);
        else res.status(500).send(parsedResult);
    })
  })
  .put('/:id', authorizedOnly, (req, res) => {
    const newArchitecture = req.body;
    if(newArchitecture.name && newArchitecture.id) {
        archDB.modifyArchitecture(newArchitecture).then((parsedResult) => {
            if(parsedResult.success) res.status(200).send(parsedResult);
            else res.status(500).send(parsedResult);
        })
    }
    else {
        res.status(500).send({
            success: false,
            errorMsg: "Missing fields."
        })
    }
  })

module.exports = router;