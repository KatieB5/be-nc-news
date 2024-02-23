const db = require('../db/connection');
const fs = require('fs/promises');

exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics').then((response) => {
        return response.rows;
    });
};

exports.readAllEndpoints = () => {
    return fs.readFile('./endpoints.json', 'utf8')
    .then((response) => {
        const parsedEndpoints = JSON.parse(response);
        return parsedEndpoints;
    });
};

exports.selectTopicByTopicName = (topic) => {
    return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: `Topic "${topic}" does not exist`})
        } else {
            return rows;
        }
    })
}

