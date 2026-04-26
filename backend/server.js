import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './routes/url.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
}));
app.use(express.json());

app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


