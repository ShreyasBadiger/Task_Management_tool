const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
    let token;

    // Check if token is present in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, 'secretKey');

            // Attach the user to the request object
            req.user = await User.findById(decoded.id).select('-password');
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    // If no token is found
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
