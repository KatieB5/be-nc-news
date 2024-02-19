const {selectAllTopics, readAllEndpoints} = require('../models/topics_model');

exports.getAllTopics = function getAllTopics(request, response, next) {
    selectAllTopics().then((topicsArr) => {
        response.status(200).send({topicsArr});
    }).catch((error) => {
        next(error);
    });
};

exports.getAllEndpoints = function getAllEndpoints(request, response, next) {
    readAllEndpoints().then((endpoints) => {
        response.status(200).send({endpoints});
    }).catch((error) => {
        next(error);
    });
};