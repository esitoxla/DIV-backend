import mongoose from 'mongoose'


const uri = process.env.MONGO_URI

export default async function connectDB() {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected Successfully at: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error:', error);
        process.exit(1); // Optional: exit process on failure
    }
}
