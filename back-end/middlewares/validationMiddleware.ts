import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Validation result middleware
export const validate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

// Login validation
export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validate
] as RequestHandler[];

// Signup validation
export const signupValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers and underscores'),
    body('password')
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage('Password must be at least 6 characters long, contain one uppercase letter, one number and one special character'),
    validate
] as RequestHandler[];

// Password reset validation
export const resetPasswordValidation = [
    body('password')
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage('Password must be at least 6 characters long, contain one uppercase letter, one number and one special character'),
    body('resetToken')
        .notEmpty()
        .withMessage('Reset token is required'),
    validate
] as RequestHandler[];

// Send reset link validation
export const sendLinkValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    validate
] as RequestHandler[];

// Agent request validation
export const agentRequestValidation = [
    body('company')
        .notEmpty()
        .withMessage('Company name is required')
        .trim(),
    body('country')
        .notEmpty()
        .withMessage('Country is required')
        .trim(),
    validate
] as RequestHandler[];

// Pagination validation
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('type')
        .optional()
        .isString()
        .withMessage('Type must be a string'),
    validate
] as RequestHandler[];

// Delete agent validation
export const deleteAgentValidation = [
    param('id')
        .notEmpty()
        .withMessage('Agent ID is required')
        .isMongoId()
        .withMessage('Invalid agent ID format'),
    validate
] as RequestHandler[];

// OTP validation
export const otpValidation = [
    body('otp')
        .notEmpty()
        .withMessage('OTP is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),
    validate
] as RequestHandler[]; 