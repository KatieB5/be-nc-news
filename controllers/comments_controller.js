const {selectCommentsByArticleId} = require('../models/comments_model');
const {selectArticleById} = require('../models/articles_model');

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