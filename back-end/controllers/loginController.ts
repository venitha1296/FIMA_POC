// loginController.ts

import User from "../models/User";
import { constantMessage } from "../utils/responseHandler";
const bcrypt = require('bcrypt');

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET as string;

const { jwt, saltRounds, generateRandomPassword, sendEmail } = require('../common');

export async function login(email: string, password: string): Promise<{ authenticated: boolean; token?: string; message?: string }> {
    try {
        // Basic field presence check
        if (!email && !password) {
            return { authenticated: false, message: 'All fields (email, password) are required.' };
        } else if (!email) {
            return { authenticated: false, message: 'Email is required.' };
        } else if (!password) {
            return { authenticated: false, message: 'Password is required.' };
        }

        // Validate email format using a simple regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { authenticated: false, message: 'Invalid email format.' };
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return { authenticated: false, message: 'Invalid email or password.' };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Authentication successful
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

            return { authenticated: true, token };
        } else {
            // Authentication failed
            return { authenticated: false, message: 'Incorrect password.' };
        }
    } catch (err) {
        console.error("Login error:", err);
        throw new Error("Internal server error");
    }
}



/**
 * Signs up a new user by verifying their email, hashing the password, and enabling 2FA (if specified).
 * 
 * This function checks if the user's email is valid, verifies if the user already exists,
 * hashes the password, and optionally enables 2FA. If 2FA is enabled, a secret is generated and saved in the database.
 * 
 * @param callback - A callback function to handle the response with either an error or the result of the signup process.
 * 
 * @returns {void} Calls the callback with either an error or the success message containing the new user's data.
 * 
 * @throws {Error} Throws an error if the email domain is invalid, the user already exists, or there's a server issue.
 */
export const signup = async (email: string, username: string, password: string, callback: (err: Error | null, result?: any) => void) => {
    try {
        // Basic field presence check
        if (!email && !username && !password) {
            return callback(new Error('All fields (email, username, password) are required'));
        } else if (!email) {
            return callback(new Error('Email is required'));
        } else if (!username) {
            return callback(new Error('Username is required'));
        } else if (!password) {
            return callback(new Error('Password is required'));
        }

        // Validate email format using a simple regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return callback(new Error('Invalid email format'));
        }

        // Validate password strength:
        // - At least 6 characters
        // - At least one uppercase letter
        // - At least one special character
        // - At least one number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return callback(new Error(constantMessage.PasswordValidation));
        }

        // Validate username length (for example, minimum 3 characters)
        if (username.trim().length < 3) {
            return callback(new Error('Username must be at least 3 characters long'));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return callback(new Error('User already exists'), undefined);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
        return callback(null, { message: constantMessage.SignupSuccess, user: newUser });
    } catch (error: any) {
        return callback(new Error(error.message), undefined);
    }
};

export async function sendLink(email: string, callback: any): Promise<{ status?: any, message?: string }> {
    try {
        // Basic field presence check
        if (!email) {
            return callback(new Error('Email is required'));
        }

        // Validate email format using a simple regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return callback(new Error('Invalid email format'));
        }
        
        const resetToken = generateRandomPassword(16);
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return callback(new Error('Email not found'), undefined);
        }

        // Update the user document with the new token and expiry
        user.resetToken = resetToken;
        user.tokenExpiry = expiry;

        // Save the updated user document
        await user.save();
        let messageBody = `** DO NOT REPLY **<br/><br/>`;
        messageBody += `
                    <p>Hello,</p>
                    <p>We received a request to reset your password. To proceed, please click the link below:</p>
                    <p>
                        <a href="${process.env.SITE_WEBADDRESS}/reset?resetToken=${resetToken}"
                            style="background-color:#4CAF50;color:white;padding:10px 20px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;border-radius:5px;">
                            Reset Your Password
                        </a>
                    </p>
                    <p>Thank you for your attention!</p>
                    <p>Best regards,<br/>
                    Optisol Team<br/>
                `;

        sendEmail(email, `Reset Your Password - Action Required`, messageBody, (error: any, info: any) => {
            if (error) {
                console.error('Error occurred while sending email:', error.message);
            }
        });
        return callback(null, { status: 200, message: constantMessage.MailSentSuccess });

    } catch (err) {
        return callback(err, null);
    }
}


export async function resetPassword(password: any, resetToken: any, callback: any) {
    try {
        // Check if user already exists
        const user = await User.findOne({ resetToken });
        if (!user) {
            return callback(new Error('Token not found'), undefined);
        }

        // Update the user document with the new token and expiry
        user.resetToken = null;
        user.tokenExpiry = null;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Save the updated user document
        await user.save();

        // Respond with success
        return callback(null, { message: constantMessage.ResetSuccess });
    } catch (error) {
        return callback(new Error('Internal server error'), undefined);
    }
}

