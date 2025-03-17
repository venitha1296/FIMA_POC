import { Router, Request, Response } from 'express';
import { login, signup, sendLink, resetPassword } from '../controllers/loginController';
import { 
    loginValidation, 
    signupValidation, 
    sendLinkValidation, 
    resetPasswordValidation 
} from '../middlewares/validationMiddleware';
import {
    loginLimiter,
    passwordResetLimiter,
    trackLoginAttempts,
    bruteForceProtection
} from '../middlewares/securityMiddleware';

const router = Router();

// Login route with rate limiting and brute force protection
router.post('/login', 
    loginLimiter, // Rate limiting
    bruteForceProtection, // Brute force protection
    trackLoginAttempts, // Track failed attempts
    loginValidation, // Input validation
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const results = await login(email, password);

            if (results.authenticated) {
                // Reset failed attempts on successful login
                (req as any).loginAttempts?.reset();
                res.json(results);
            } else {
                // Increment failed attempts counter
                (req as any).loginAttempts?.increment();
                res.status(401).json(results);
            }
        } catch (error: any) {
            console.error('Login route error:', error);
            res.status(500).json({ authenticated: false, message: error.message || 'Internal server error' });
        }
    }
);

// Signup route
router.post('/signup', signupValidation, async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    
    signup(email, username, password, (err: Error | null, results?: any) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Send reset password link route with rate limiting
router.post('/sendLink', 
    passwordResetLimiter,
    sendLinkValidation, 
    async (req: Request, res: Response) => {
        const { email } = req.body;
        
        sendLink(email, (err: Error | null, results?: any) => {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json(results);
            }
        });
    }
);

// Reset password route with rate limiting
router.post('/resetPassword', 
    passwordResetLimiter,
    resetPasswordValidation, 
    async (req: Request, res: Response) => {
        const { password, resetToken } = req.body;
        
        resetPassword(password, resetToken, (err: Error | null, results?: any) => {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json(results);
            }
        });
    }
);

export default router; 