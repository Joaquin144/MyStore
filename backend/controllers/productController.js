//related to API stuff

const catchAsyncError = require("../middleware/catchAsyncError");
const { findById } = require("../models/productModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require('../utils/apifeatures');

//Create Product    ---> [Admin Only]
exports.createProduct = catchAsyncError(async (req,res,next) => {
    req.body.user = req.user.id//We store the id of admin performing this operation and send it to MongoDB for it to automatically sotre the product creaotr's id along with product info
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
});

//Get All Products 
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
  
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query;
  
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  });

//Update Product with id  ---> [Admin Only]
exports.updateProduct = catchAsyncError(async (req,res,next)=>{
    ////console.log(`The id of prod was: ${req.params.id}`)
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
});

//Delete Product with id --> [Admin Only]
exports.deleteProduct = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted successfully"
    });
});

//Get ProductDetails with id
exports.getProductDetails = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }
    res.status(200).json({
        success:true,
        product
    });
});


//Create Product Review by user or update an existing review by that user
exports.createProductReview = catchAsyncError( async (req,res,next)=>{
    const {rating, comment, productId} = req.body
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find((rev)=>rev.user.toString() === req.user._id.toString());//reviews array ke each element(=rev) ke liye jab given condition true ho

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating=rating,
                rev.comment=comment
            }
        });
    }else{
        product.reviews.push(review)
        product.numberOfReviews=product.reviews.length;//[check] if product.numberOfReviews++ will work or not
    }
    let avg = 0;
    product.ratings = product.reviews.forEach(rev=>{
        avg += rev.rating;
    });
    avg /= product.reviews.length;
    product.ratings = avg;

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true
    });
});


//Get All Reviews of a single Product
exports.getProductReviews = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});


//Delete a Review
exports.deleteReview = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }

    const reviews = product.reviews.filter(rev=>
        rev._id.toString() != req.query.id.toString()//here id means reviewId
    );//At the end of filtering, review array will contain all but one review whose id was equal to productId

    let sum = 0;
    reviews.forEach((rev)=>{
        sum += rev.rating;
    });
    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = sum / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
        success:true
    });
});
