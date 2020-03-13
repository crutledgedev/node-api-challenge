const express = require('express');
const Projects = require('../helpers/projectModel');
const router = express.Router();



//end points

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error retrieving projects." });
        });
});

router.get('/:id', validateId, (req, res) => {
    let id = req.params.id;
    Projects.get(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error retrieving project." })
        });
});

router.get('/:id/actions', validateId, (req, res) => {
    let id = req.params.id;
    Projects.get(id)
        .then(actionList => {
            res.status(200).json(actionList.actions);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error retrieving project." })
        });
});

router.post('/', validateProject, (req, res) => {
    let actionBody = req.body;

    Projects.insert(actionBody)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(err => {
            if(err.errno === 19){
                res.status(500).json({ errorMessage: "Invalid ID." });
            } else {
                res.status(500).json({ errorMessage: "Error posting" });
            }
        });
});

router.delete('/:id', validateId, (req, res) => {
    let id = req.params.id;
    Projects.remove(id)
        .then(count => {
            if(count < 1){
                res.status(404).json({ errorMessage: "Project ID not found." })
            } else {
                res.status(200).json({ message: "Project deleted." });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error removing project" });
        });
});

router.put('/:id', validateId, (req, res) => {
    let id = req.params.id;
    let changes = req.body;

    Projects.update(id, changes)
        .then(changedProject => {
            res.status(200).json(changedProject);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error editing project" });
        });
});

// middleware

function validateId(req, res, next) {
    let id = req.params.id;
    Projects.get(id)
        .then(action => {
            if(!action){
                res.status(404).json({ errorMessage: "ID not found." })
            } else {
                next();
            }
            
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error validating ID." })
        })
}

function validateProject(req, res, next) {
    let description = req.body.description;
    let name = req.body.name;
    if(!name || !description){
        res.status(400).json({ errorMessage: "A name and a description are required " });
    } else {
        next();
    }
    
}

module.exports = router;
