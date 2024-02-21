const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
    return db.query('SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
    .then(({rows}) => {
        return rows;
    })
}

exports.insertNewComment = ({username, body}, article_id) => {
    return db.query('INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, $4, NOW()::date) RETURNING *;', [body, username, article_id, 0])
    .then(({rows}) => {
        return rows;
    })
    
}