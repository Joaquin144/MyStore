const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User =require("../models/userModel");

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
    res.status(201).json({
        success:true,
        user
    });
})