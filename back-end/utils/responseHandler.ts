//@ts-ignore
import { Response } from 'express';

// Object to store constant messages for various successful operations
export const constantMessage = {
    SignupSuccess: "User created successfully", 
    MailSentSuccess: "Password reset email sent successfully",
    ResetSuccess: "Password reset successfully", 
    AgentsFetchSuccess: "Agents fetched successfully!",
    AgentRequestSuccess: "Agent request created successfully!",
    AgentUpdateSuccess: "Agent updated with AI output successfully",
    PasswordValidation: 'Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character'
};

export const sendSuccess = (
    res: Response,
    data: any,
    message: string = 'Success',
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (
    res: Response,
    error: any,
    message: string = 'Error',
    statusCode: number = 500
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error.message || error,
    });
};
