const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//Config
dotenv.config({ path: "backend/config/config.env" });

//Connecting to DB
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at PORT: ${process.env.PORT}`);
});

//Unhandled Promise Rejection --> eg. occurs when mongodb url is wrong
//Objective: In such kinds of errors we should shut down server quickly
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to Unhandled Promise Rejection`);
    
    server.close(()=>{
        process.exit(1);
    });
})