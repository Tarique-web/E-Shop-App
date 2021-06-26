const express = require('express')
const app = express();
const morgan = require('morgan')
const db = require("./config/db")

require('dotenv/config')
const bodyParser = require("body-parser");

const router = express.Router();

// middleware
app.use(bodyParser.json());

app.use('/', router);
// Base URL
app.use('/users',require('./routes/userRouts'));
app.use('/product',require('./routes/productRouts'));
app.use('/category',require('./routes/categoryRouts'));

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server is running port http://localhost:${PORT}`);
})