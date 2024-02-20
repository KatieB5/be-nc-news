const db = require('../db/connection');

exports.selectArticleById = function selectArticleById(article_id) {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, msg: `No article found for article_id: ${article_id}`})
        }
        return response.rows[0];
    });
};