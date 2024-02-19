const db = require('../db/connection');

exports.selectAllTopics = function selectAllTopics() {
    return db.query('SELECT * FROM topics').then((response) => {
        return response.rows;
    });
};