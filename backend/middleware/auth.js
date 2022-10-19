const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError( async (req,res,next)=>{
    const {token} = req.cookies;//With every request cookies also come. So we just search for jwt_token in cookies
    if(!token){//token is null means user wasn't logged in
        return next(new ErrorHandler("Please login to access this resource",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();//calls the next handler. eg. we need to check authorisation after authentication.
});

exports.authorizeRoles = (...roles)=>{//we take array(=roles) as a parameter
    return (req,res,next)=>{
        console.log(`${roles}`)
        if(!roles.includes(req.user.role)){//We don't have any kind of job role for you
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();//this calls the next handler. In case of next handler missing the function will exit/return.
    }
}