import { Router, Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Check authentication status
const checkAuth: RequestHandler = (req, res) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            res.json({ user: decoded });
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout route
const logout: RequestHandler = (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
    res.json({ message: 'Logged out successfully' });
};

router.get('/check', checkAuth);
router.post('/logout', logout);

export default router; 