const mongoose = require('mongoose');


const connectDatabase = ()=>{
    mongoose.connect("mongodb://localhost:27017/ecomm",{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
        console.log(`MongoDB connected with server ${data.connection.host}`);
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = connectDatabase