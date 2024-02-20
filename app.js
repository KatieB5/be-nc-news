const express = require('express');
const app = express();
const {getAllTopics, getAllEndpoints} = require('./controllers/topics_controller');
const {getArticleById} = require('./controllers/articles_controller');
const {
    handleServerErrors,
    handleCustomErrors,
    handlePsqlErrors,
  } = require('./errors/index.js');

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.all('/*', (request, response) => {
    response.status(404).send({msg: "Endpoint does not exist"});
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;