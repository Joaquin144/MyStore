const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Product Name cannot be empty"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Product description cannot be empty"],
    },
    price:{
        type:Number,
        required:[true,"Product price cannot be empty"],
        maxLength:[8,"Are you serious bro ?"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {//We need to host images somewhere and we will use that link to access those images
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Product category cannot be blank"]
    },
    Stock:{
        type:Number,
        required:[true,"Please enter a number for stock"],
        maxLength:[4,"git commit -m suicide"],
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema);//similar to Android: Like we create a SQLite table from model class and use it for queries [using @Entity]