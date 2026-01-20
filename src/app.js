// using express framework for server creation
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// import routes for user authentication
const authRoutes = require('./routes/auth');

// import routes for reports
const reportsRoutes = require('./routes/reports');

// import routes for trees
const treesRoutes = require('./routes/trees');

// import routes for adoptions
const adoptionsRoutes = require('./routes/adoptions');

// create express app
const app = express();

// middleware for handling CORS and parsing JSON bodies
app.use(cors());
app.use(express.json());

// static files for the frontend 
app.use('/', express.static(process.env.FRONTEND || 'static'));
app.use('/', express.static('static'));

// route for user authentication
app.use('/auth', authRoutes);

// route for reports
app.use('/reports', reportsRoutes);

// route for trees
app.use('/trees', treesRoutes);

// route for adoptions
app.use('/adoptions', adoptionsRoutes);


// health check route for the API
app.get('/health', (req, res) => {
  res.json({message: 'Treento API running'});
});

// DB connection setup with MongoDB via Mongoose
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});   

