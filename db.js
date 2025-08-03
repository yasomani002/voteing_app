const mongoose = require('mongoose')

const mongooseURI = 'mongodb://localhost:27017/vote_app'

const connectDB = async () => {
    try {
        await mongoose.connect(mongooseURI)
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB connection error', error)
        process.exit(1)
    }
}

module.exports = connectDB