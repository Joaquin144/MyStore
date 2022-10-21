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
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

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

//Get User Details
exports.getUserDetails = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id);//Since on logging in whole user is saved in req so we can access the id alng with other parameters. --> See auth.js for more details

    res.status(200).json({
        success:true,
        user
    });
    
});

//Update User Password
exports.updatePassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched =await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is wrong",400));
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler("New Password doesn't matches with old one",400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
    
});

//Update User Profile
exports.updateProfile = catchAsyncError(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    //todo:Provie option to upload avatar(=profile pic)

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })
    
});


//Get all users (Admin only)
exports.getAllUsers = catchAsyncError(async (req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    });
});


//Get User Detail (Admin only)
exports.getSingleUser = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User with id: ${req.params.id} is not found`),400);
    }

    res.status(200).json({
        success:true,
        user
    });
});


//Update User Role --> Admin Only
exports.updateUserRole = catchAsyncError(async (req,res,next)=>{
    const user1 = await User.findById(req.params.id);
    if(!user1){
        return next(new ErrorHandler(`User with id: ${req.params.id} is not found`),400);
    }

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        user
    });
});


//Delete User --> Admin Only
exports.deleteUser = catchAsyncError(async (req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User with id: ${req.params.id} is not found`),400);
    }

    //todo: Delete hosted Proifle Pic of this user too so that it doesn't consumes space and thus expenses

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    });
});