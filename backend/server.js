const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//Config
dotenv.config({ path: "backend/config/config.env" });

//Connecting to DB
connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at PORT: ${process.env.PORT}`);
});