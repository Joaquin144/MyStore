const app = require("./app")

//const app = require('./app');
const dotenv = require("dotenv");

//Config
dotenv.config({ path: "backend/config/config.env" });


app.listen(4000, ()=>{
    console.log(`Server is listening at PORT: 4000`);
});

// app.listen(process.env.PORT, ()=>{
//     console.log(`Server is listening at PORT: ${process.env.PORT}`);
// });