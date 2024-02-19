const {selectAllTopics} = require('../models/topics_model');

exports.getAllTopics = function getAllTopics(request, response, next) {
    selectAllTopics().then((topicsArr) => {
        response.status(200).send({topicsArr});
    }).catch((error) => {
        next(error);
    });
};