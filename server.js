const express = require('express');
const server = express();
 const actionRouter = require('./data/routers/actionRouter.js');
const projectRouter = require('./data/routers/projectRouters.js');

server.use(express.json());
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);




server.get('/', (req, res) => {
    res.send(`<h2>We have a pulse!<h2>`);
})


module.exports = server;