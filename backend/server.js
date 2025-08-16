// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const procurementRoutes = require('./routes/procurementRoutes');
const hardwareRoutes = require('./routes/hardwareRoutes');
const supportRoutes = require('./routes/supportRoutes');
const bugRoutes = require('./routes/bugRoutes');

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// JSON body parser
app.use(express.json());

// MongoDB connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Base route
app.get('/', (req, res) => res.json({ status: 'ok' }));

// Modular routes
app.use('/api/procurements', procurementRoutes);
app.use('/api/hardware', hardwareRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/bugs', bugRoutes);

module.exports = app;
