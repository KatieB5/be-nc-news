exports.handleServerErrors = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: 'Internal Server Error' });
};