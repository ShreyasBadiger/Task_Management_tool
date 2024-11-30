const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', protect, taskRoutes);  // Protect task routes with authentication middleware

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
