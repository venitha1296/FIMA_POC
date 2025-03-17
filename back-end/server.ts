import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { logAIResponse } from "./controllers/AgentController";
import { connectDB } from "./config/database";
import loginRouter from './routes/loginRoutes';
import agentRouter from './routes/agentRoutes';
import aiRouter from './routes/aiRoutes';
import { checkAuthHeader } from './middlewares/authMiddleware';

// Load environment variables
dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Use routes
app.use('/api', loginRouter);
app.use('/api/agents', checkAuthHeader as express.RequestHandler, agentRouter);
app.use('/api/thirdparty', aiRouter);

// Handle AI response with auth check
app.post('/api/agents/:id', checkAuthHeader as express.RequestHandler, async (req: Request, res: Response, next: NextFunction) => {
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
