const app = require('./app');

app.listen(3000,()=>{
    console.log(`Server is listening at PORT: ${3000}`);
});





// const express = require('express');
// const app = express();

// app.listen(3000,()=>{
//     console.log(`Server is listening at PORT: ${3000}`);
// });













// const app = require('./app');
// const dotenv = require("dotenv");

// //Config
// dotenv.config({ path: "backend/config/config.env" });


// app.listen(process.env.PORT, ()=>{
//     console.log(`Server is listening at PORT: ${process.env.PORT}`);
// });