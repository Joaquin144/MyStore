const express = require('express');
const errorMiddleware = require("./middleware/error");

//Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use("/api/v1",product);
app.use("/api/v1",user);

//MiddleWare for error
app.use(errorMiddleware);

module.exports = app;