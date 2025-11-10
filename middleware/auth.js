const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        
        // Fetch user details from database
        dbService.findUserById(user.userId, (err, userDetails) => {
            if (err || !userDetails) {
                return res.status(403).json({ message: 'User not found' });
            }
            
            req.user = userDetails;
            next();
        });
    });
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        if (!roles.includes(req.user.user_type)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};