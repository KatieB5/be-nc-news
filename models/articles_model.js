const db = require('../db/connection');

exports.selectAllArticles = (topic) => {

    const queryStrSelect = 'SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id '

    const queryStrGroupAndOrder = ' GROUP BY articles.article_id ORDER BY articles.created_at DESC'

    if (topic) {
        const topicStr = 'WHERE articles.topic = $1'
        
        const queryStrWithTopic = queryStrSelect + topicStr + queryStrGroupAndOrder;

        return db.query(queryStrWithTopic, [topic])
        .then(({rows}) => {

            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: `No article found for topic: ${topic}`})
            }

            return rows;
        })
    } else {
        const queryStr = queryStrSelect + queryStrGroupAndOrder;
        return db.query(queryStr)
        .then(({rows}) => {
            return rows;
        });
    };
};

exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: `No article found for article_id: ${article_id}`})
        };
        return rows[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_votes, article_id])
    .then(({rows}) => {
        return rows[0];
    });
};