const mongoose = require('mongoose');

const connectDB = (URL) => {
    try {
        console.log('connected to DB')
        return mongoose.connect(URL)        
    } catch (error) {
        console.log('there was an error in connection')
    }
    
}

module.exports = connectDB