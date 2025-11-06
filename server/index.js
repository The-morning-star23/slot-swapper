import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// --- Import Routes ---
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import swapRoutes from './routes/swapRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// --- Middleware ---
const corsOptions = {
  // FIX 1: Removed the trailing slash
  origin: 'https://slot-swapper-black.vercel.app', 
  optionsSuccessStatus: 200 // For preflight requests
};

app.use(cors(corsOptions));

// Enable parsing of JSON request bodies
app.use(express.json());

// --- Simple Test Route ---
app.get('/', (req, res) => {
  res.send('SlotSwapper API is running...');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

// --- Start Server ---
connectDB().then(() => {
  app.listen(PORT, () => {
    // FIX 2: Cleaned up the log message
    console.log(`Server is running on port ${PORT}`);
  });
});