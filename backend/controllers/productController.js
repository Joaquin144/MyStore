//related to API stuff

const { findById } = require("../models/productModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");

//Create Product    ---> [Admin Only]
exports.createProduct = async (req,res,next) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        success:true,
        product
    });
}

//Get All Products 
exports.getAllProducts = async (req,res)=>{
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    });
}

//Update Product with id  ---> [Admin Only]
exports.updateProduct = async (req,res,next)=>{
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
}

//Delete Product with id --> [Admin Only]
exports.deleteProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted successfully"
    });
}

//Get ProductDetails with id
exports.getProductDetails = async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product does not exists",404));
    }
    res.status(200).json({
        success:true,
        product
    });
}
