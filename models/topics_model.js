const db = require('../db/connection');
const fs = require('fs/promises');

exports.selectAllTopics = function selectAllTopics() {
    return db.query('SELECT * FROM topics').then((response) => {
        return response.rows;
    });
};

exports.readAllEndpoints = function readAllEndpoints() {
    return fs.readFile('./endpoints.json', 'utf8')
    .then((response) => {
        const parsedEndpoints = JSON.parse(response);
        return parsedEndpoints;
    });
};