

// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set configuration options for Mongoose
        mongoose.set('strictQuery', false);

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

module.exports = connectDB;

