import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import procurementRoutes from './routes/procurementRoutes.js';
import hardwareRoutes from './routes/hardwareRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import bugRoutes from './routes/bugRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));

app.get('/', (req, res) => res.json({ status: 'ok' }));

// Use modular routes
app.use('/api/procurements', procurementRoutes);
app.use('/api/hardware', hardwareRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/bugs', bugRoutes);
