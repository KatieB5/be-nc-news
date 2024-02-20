const {selectArticleById} = require('../models/articles_model');

exports.getArticleById = function getArticleById(request, response, next) {
    const {article_id} = request.params;
    selectArticleById(article_id).then((articleObj) => {
        response.status(200).send({articleObj})
    }).catch((error) => {
        next(error);
    });
};

