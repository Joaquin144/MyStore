const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../middleware/jwtToken");

//Registration for user
exports.registerUser = catchAsyncError( async (req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"sample public is for avatar",
            url:"profile_pic_url"
        }
    });

    sendToken(user,201,res);
});


//Login User
exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;
    //checking if user has given both email and pswd
    if(!email || !password){
        return next(new ErrorHandler("Please Enter both email and password",400));
    }

    const user = await User.findOne({email:email}).select("+password");//we will specifically retrieve the password as we turned it off by default

    if(!user){
        return next(new ErrorHandler("Inavlid email [or password ?]",401));
    }

    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Inavlid Password. Are you a hacker bro ?",401));
    }

    sendToken(user,200,res);
});


//LogOut User
exports.logout = catchAsyncError(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logout successfull"
    });
});