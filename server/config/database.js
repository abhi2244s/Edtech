const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const dbConnection = ()=>{
    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to MongoDB');
    }
    ).catch((err)=>{
        console.log(err);
        process.exit(1);
    }
    );
}

module.exports = dbConnection;