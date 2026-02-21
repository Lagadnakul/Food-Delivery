import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nakullagad084_db_user:Nakul12345@cluster0.yb6pf9c.mongodb.net/HungerHive?retryWrites=true&w=majority';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};