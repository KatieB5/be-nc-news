exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    } else next(error);
};

exports.handlePsqlErrors = (error, request, response, next) => {
    if (error.code === '22P02' || error.code === 23505) {
        response.status(400).send({ msg: 'Invalid input' });
    } else next(error);
};

exports.handleServerErrors = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: 'Internal Server Error' });
};