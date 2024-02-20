const db = require('../db/connection');

exports.selectAllArticles = () => {
    return db.query('SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC')
    .then(({rows}) => {
        console.log(rows);
        const newArticleArr = rows.map((articleObj) => {
            const newArticleObj = {...articleObj};
            delete newArticleObj.body;
            return newArticleObj;
        })
        return newArticleArr;
    })
}

exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, msg: `No article found for article_id: ${article_id}`})
        }
        return response.rows[0];
    });
};