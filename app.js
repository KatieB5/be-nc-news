const express = require('express');
const app = express();
const {getAllTopics} = require('./controllers/topics_controller');
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors/index.js');

app.get('/api/topics', getAllTopics)

app.all('/*', (request, response) => {
    response.status(404).send({msg: "404 Not Found"});
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;