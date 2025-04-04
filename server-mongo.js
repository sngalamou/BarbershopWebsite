const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
require('dotenv').config();

// Initialize app
const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/services', require('./routes/services'));
app.use('/api/staff', require('./routes/staff'));

// Basic route
app.get('/', (req, res) => res.json({ msg: 'Welcome to the Barbershop API' }));

// Error handling middleware
app.use(errorHandler);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));