const db = require('../db/connection');

exports.selectAllArticles = (topic, sort_by='created_at', order='DESC') => {

    const validSoryBys = ["title", "topic", "author", "created_at", "votes", "article_img_url"];

    const validOrders = ["ASC", "DESC"]

    const queryStrSelect = 'SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id '

    const queryStrGroup = ' GROUP BY articles.article_id'

    if (!validSoryBys.includes(sort_by)) {
        return Promise.reject({status: 400, msg: `${sort_by} is not a valid sort_by query`})
    } 
    
    if (!validOrders.includes(order.toUpperCase())) {
        return Promise.reject({status: 400, msg: `${order} is not a valid order query`})
    }
    
    if (topic) {
        const topicStr = 'WHERE articles.topic = $1';
        
        const queryStrWithTopic = queryStrSelect + topicStr + queryStrGroup + ' ORDER BY articles.' + sort_by + ' ' + order.toUpperCase()

        return db.query(queryStrWithTopic, [topic])
        .then(({rows}) => {
            return rows;
        })

    } else {
        const queryStr = queryStrSelect + queryStrGroup + ' ORDER BY articles.' + sort_by + ' ' + order.toUpperCase();
        return db.query(queryStr)
        .then(({rows}) => {
            return rows;
        });
    };
};

exports.selectArticleById = (article_id) => {
    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id', [article_id])
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