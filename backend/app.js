const express = require('express');
const errorMiddleware = require("./middleware/error");
const cookieParser = require('cookie-parser');

//Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

//MiddleWare for error
app.use(errorMiddleware);

module.exports = app;