const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numset = '0123456789';
    const specialset = '!@#$%^&*()-_+=';
    let password = '';

    for (let i = 0; i < length; i++) {
    	let randomIndex = '';
    		if (i == 0) {
        	randomIndex = Math.floor(Math.random() * numset.length);
            password += numset[randomIndex];
        } else if (i == 1) {
        	randomIndex = Math.floor(Math.random() * specialset.length);
            password += specialset[randomIndex];
        } else {
        	randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
    }

    return password;
}

function sendEmail(email, subject, body, callback) {
    console.log("sendEmail")
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: true,
        }
    });

    transporter.sendMail({
        from: '"'+process.env.EMAIL_FROM_TITLE+'" <'+process.env.EMAIL_FROM_EMAIL+'>',
        to: email,
        subject: subject,
        html: body
    }, callback);
}

module.exports = { jwt, bcrypt, saltRounds, generateRandomPassword, sendEmail }