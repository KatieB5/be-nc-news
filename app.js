const express = require('express');
const app = express();
const cors = require('cors');
const {getAllTopics, getAllEndpoints} = require('./controllers/topics_controller');
const {getArticleById, getAllArticles, patchArticleById} = require('./controllers/articles_controller');
const {getCommentsByArticleId, postNewComment, deleteCommentById} = require('./controllers/comments_controller');
const {getAllUsers, getUserByUsername} = require('./controllers/users_controller')
const {
    handleServerErrors,
    handleCustomErrors,
    handlePsqlErrors,
  } = require('./errors/index.js');

app.use(cors());

app.use(express.json());

app.get('/api', getAllEndpoints);
  
app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postNewComment);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api/users', getAllUsers);

app.get('/api/users/:username', getUserByUsername);

app.all('/*', (request, response) => {
    response.status(404).send({msg: "Endpoint does not exist"});
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;