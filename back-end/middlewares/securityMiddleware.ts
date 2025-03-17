import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import ExpressBrute from 'express-brute';

interface LoginAttempts {
    count: number;
    increment: () => void;
    reset: () => void;
}

// Extend Express Request type to include loginAttempts
declare global {
    namespace Express {
        interface Request {
            loginAttempts?: LoginAttempts;
        }
    }
}

// Store failed login attempts in memory
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, {
    freeRetries: 5, // Number of retries before delay starts
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour
    lifetime: 24 * 60 * 60, // 24 hours (how long to remember requests)
});

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limit for login attempts
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per hour
    message: { error: 'Too many password reset attempts, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Track failed login attempts
export const trackLoginAttempts: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    store.get(clientIp, (err: any, data: any) => {
        if (err) {
            console.error('Error getting login attempts:', err);
            next(err);
            return;
        }

        const currentAttempts = (typeof data === 'number' ? data : 0);

        // Attach login attempts tracking to request object
        req.loginAttempts = {
            count: currentAttempts,
            increment: () => {
                store.set(clientIp, currentAttempts + 1, 24 * 60 * 60, (err: any) => {
                    if (err) console.error('Error incrementing login attempts:', err);
                });
            },
            reset: () => {
                store.reset(clientIp, (err: any) => {
                    if (err) console.error('Error resetting login attempts:', err);
                });
            }
        };

        next();
    });
};

// Security headers middleware
export const securityHeaders: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    // Remove sensitive headers
    res.removeHeader('X-Powered-By');
    
    // Set security headers
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // More permissive CSP that allows necessary resources
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;");
    
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Add Access-Control-Allow-Private-Network header for local development
    if (process.env.NODE_ENV === 'development') {
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    
    next();
};

// Brute force protection for login
export const bruteForceProtection: RequestHandler = bruteforce.prevent; 