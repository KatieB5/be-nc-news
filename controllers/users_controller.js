const {selectAllUsers} = require('../models/users_model');

exports.getAllUsers = (request, response, next) => {
    selectAllUsers().then((usersArr) => {
        response.status(200).send(usersArr)
    }).catch((error) => {
        next(error);
    });
};