const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../middleware/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

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
    console.log(`email: ${email} and pass: ${password}`);
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


//Reset or Forgot Password
exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not Found",404));
    }
    //get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`;

    const message = `This is for testing purposes. Jisko mile woh IGNORE kar dena.\n\nYour password reset token is:--- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it.\n\n`;
    
    try{
        await sendEmail({
            email:user.email,
            subject:`MyStore Password recovery Mail`,
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message, 500));
    }
});


//Reset Password
exports.resetPassword = catchAsyncError(async (req,res,next)=>{
    //Creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler(`Reset password token is either invalid or has expired`,400));
    }
    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler(`Passwords don't match`,400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
});