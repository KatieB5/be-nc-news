const {selectAllUsers, selectUserByUsername} = require('../models/users_model');

exports.getAllUsers = (request, response, next) => {
    selectAllUsers().then((usersArr) => {
        response.status(200).send(usersArr)
    }).catch((error) => {
        next(error);
    });
};

exports.getUserByUsername = (request, response, next) => {
    const {username} = request.params
    selectUserByUsername(username).then((user) => {
        response.status(200).send(user[0])
    }).catch((error) => {
        next(error);
    })
}