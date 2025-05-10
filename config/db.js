import mongoose from 'mongoose';
import colors from 'colors/safe.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(colors.green(`MongoDB Connected: ${conn.connection.host}`));
    }   catch (error) {
        console.log(colors.red(`Error: ${error.message}`));
        process.exit(1);
    }
};

export default connectDB;