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
    // We add 'await' here to ensure the connection is established before proceeding
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// --- Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());

// --- Simple Test Route ---
app.get('/', (req, res) => {
  res.send('SlotSwapper API is running...');
});

// --- API Routes ---
// This tells Express to use the authRoutes for any path starting with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

// --- Start Server ---
// We call connectDB and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});