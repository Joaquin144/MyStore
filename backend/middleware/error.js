const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //Wrong MongoDB ID error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //mongoose duplicate error
    if(err.code === 11000){
        const message = `Duplicate email: ${Object.keys(err.value)} entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT error
    //mongoose duplicate error
    if(err.code === "JSONWebTokenError"){
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    //JWT Expired error
    if(err.code === "TokenExpiredError"){
        const message = `Json web token is expired`;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        mesage:err.message,
        error: err.stack
    });
};