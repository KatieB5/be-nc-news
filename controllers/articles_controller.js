const {selectArticleById, selectAllArticles, updateArticleById} = require('../models/articles_model');

exports.getAllArticles = (request, response, next) => {
    selectAllArticles().then((articlesArr) => {
        response.status(200).send(articlesArr)
    }).catch((error) => {
        next(error);
    });
};

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params;
    selectArticleById(article_id).then((articleObj) => {
        response.status(200).send({articleObj})
    }).catch((error) => {
        next(error);
    });
};

exports.patchArticleById = (request, response, next) => {
    const {article_id} = request.params;
    const {inc_votes} = request.body;

    if (!inc_votes || typeof inc_votes !== "number") {
        return response.status(400).send({msg: 'Invalid input'});
    }

    const promises = [selectArticleById(article_id), updateArticleById(article_id, inc_votes)];

    Promise.all(promises)
    .then((resolvedPromises) => {
        response.status(200).send(resolvedPromises[1])
    }).catch((error) => {
        next(error);
    });
};


