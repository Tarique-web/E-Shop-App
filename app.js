const express = require('express')
const app = express();
const db = require("./config/db")

require('dotenv/config')
const bodyParser = require("body-parser");

const router = express.Router();
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

// middleware
app.use(bodyParser.json());
app.use(authJwt());
app.use(errorHandler);
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


app.use('/', router);
// Base URL
app.use('/users', require('./routes/userRouts'));
app.use('/product', require('./routes/productRouts'));
app.use('/category', require('./routes/categoryRouts'));
app.use('/users/login', require('./routes/loginRouts'));
app.use('/orders', require('./routes/orderRouts'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running port http://localhost:${PORT}`);
})