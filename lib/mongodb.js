import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://mitranikhil:Babul%40123%4033@microflix-shard-00-00.mn6ao.mongodb.net:27017,microflix-shard-00-01.mn6ao.mongodb.net:27017,microflix-shard-00-02.mn6ao.mongodb.net:27017/microflix?replicaSet=atlas-adclgf-shard-0&ssl=true&authSource=admin';

async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Successfully connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error.message);
            throw new Error('Database connection failed');
        }
    } else {
        console.log('Already connected to MongoDB');
    }
}

export default connectToDatabase;
