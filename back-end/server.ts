import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { logAIResponse } from "./controllers/AgentController";
import { connectDB } from "./config/database";
import loginRouter from './routes/loginRoutes';
import agentRouter from './routes/agentRoutes';
import aiRouter from './routes/aiRoutes';
import authRouter from './routes/authRoutes';
import { checkAuthHeader } from './middlewares/authMiddleware';
import { apiLimiter, securityHeaders } from './middlewares/securityMiddleware';

// Load environment variables
dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3001', 10);

// CORS middleware should be first
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Allow Vite and CRA default ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    credentials: true,
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200
}));

// Basic middleware
app.use(express.json({
    limit: '10mb', // Limit request body size
    verify: (req: express.Request, res: express.Response, buf: Buffer) => {
        try {
            JSON.parse(buf.toString());
        } catch (e) {
            res.status(400).json({ error: 'Invalid JSON' });
            throw new Error('Invalid JSON');
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // Add cookie-parser middleware

// Security middleware after CORS
app.use(securityHeaders);
app.use(apiLimiter); // Global rate limiting

// Use routes
app.use('/api', loginRouter);
app.use('/api/auth',checkAuthHeader as express.RequestHandler, authRouter);
app.use('/api/agents', checkAuthHeader as express.RequestHandler, agentRouter);
app.use('/api/thirdparty', aiRouter);

// Handle AI response with auth check
app.post('/api/agents/:requestId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await logAIResponse(req, res);
    } catch (error) {
        next(error);
    }
});

// Serve static files
app.use('/exports', express.static(path.join(__dirname, '../exports')));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Connect to MongoDB
connectDB().then(() => {
    // Start server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err: Error) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});
