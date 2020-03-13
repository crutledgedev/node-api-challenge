const express = require('express');
const Actions = require('../helpers/actionModel');
const router = express.Router();



//end points 

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error retrieving actions." });
        });
});

router.get('/:id', validateId, (req, res) => {
    let id = req.params.id;
    Actions.get(id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error retrieving action." });
        });
});

router.post('/', validateAction, (req, res) => {
    let actionBody = req.body;

    Actions.insert(actionBody)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(err => {
            if(err.errno === 19){
                res.status(500).json({ errorMessage: "Invalid project ID." });
            } else {
                res.status(500).json({ errorMessage: "Error posting action." });
            }
        });
});

router.delete('/:id', validateId, (req, res) => {
    let id = req.params.id;
    Actions.remove(id)
        .then(count => {
            if(count < 1){
                res.status(404).json({ errorMessage: "Action ID not found." });
            } else {
                res.status(200).json({ message: "Action deleted." });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error removing action." });
        });
});

router.put('/:id', validateId, (req, res) => {
    let id = req.params.id;
    let changes = req.body;

    Actions.update(id, changes)
        .then(changedAction => {
            res.status(200).json(changedAction);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error editing action." });
        });
});

// middleware

function validateId(req, res, next) {
    let id = req.params.id;
    Actions.get(id)
        .then(action => {
            if(!action){
                res.status(404).json({ errorMessage: "ID not found." });
            } else {
                next();
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Error checking ID." })
        })
}

function validateAction(req, res, next) {
    let project_id = req.body.project_id;
    let description = req.body.description;
    let notes = req.body.notes;

    if(!notes || !description || !project_id){
        res.status(400).json({ errorMessage: "Project ID, description, and notes are required" });
    } else {
        next();
    }
}

module.exports = router;