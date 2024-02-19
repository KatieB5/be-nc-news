const express = require('express');
const app = express();
const {getAllTopics, getAllEndpoints} = require('./controllers/topics_controller');
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors/index.js');

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);

app.all('/*', (request, response) => {
    response.status(404).send({msg: "Endpoint does not exist"});
});


app.use(handleServerErrors);

module.exports = app;