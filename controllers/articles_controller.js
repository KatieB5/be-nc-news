const {selectArticleById, selectAllArticles} = require('../models/articles_model');

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

