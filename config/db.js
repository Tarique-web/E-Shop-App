const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
require('dotenv/config')


const { DB_USERNAME, DB_PASS,DB_NAME} = process.env

const Url = `mongodb+srv://${DB_USERNAME}:${DB_PASS}@cluster0.qxvbn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(
    Url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log("Successfully Established Connection with MongoDB"))
    .catch(err => {
        console.log(`Failed to Establish Connection with MongoDB with Error: ${err.message}`);
    });
    
module.exports = mongoose;