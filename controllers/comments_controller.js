const {selectCommentsByArticleId, insertNewComment, removeCommentById} = require('../models/comments_model');
const {selectArticleById} = require('../models/articles_model');
const {selectUserByUsername} = require('../models/users_model');

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params;
    const promises = [selectArticleById(article_id), selectCommentsByArticleId(article_id)];

    Promise.all(promises)
    .then((promiseResolutions) => {
        if (promiseResolutions[1].length === 0) {
            response.status(200).send({msg: "There are no comments associated with this article!"});
        } else {
            response.status(200).send(promiseResolutions[1])
        }
    }).catch((error) => {
        next(error);
    });
};

exports.postNewComment = (request, response, next) => {
    const newComment = request.body;
    const {article_id} = request.params;

    if (!Object.keys(request.body)[0].includes('username') || !Object.keys(request.body)[1].includes('body') || Object.keys(request.body).length < 2 || typeof newComment.username !== "string" || typeof newComment.body !== "string") {
        return response.status(400).send({msg: 'Invalid input'});
    }

    const promises = [selectArticleById(article_id), selectUserByUsername(newComment.username), insertNewComment(newComment, article_id)];

    Promise.all(promises).
    then((promiseResolutions) => {
        response.status(201).send(promiseResolutions[2][0])
    }).catch((error) => {
        next(error);
    });
};

exports.deleteCommentById = (request, response, next) => {
    const {comment_id} = request.params;
        removeCommentById(comment_id).then((deletedObj) => {
            response.status(204).send();
        }).catch((error) => {
            next(error);
        })
};