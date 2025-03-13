// loginRoutes.js
const express = require('express');
const router = express.Router();
const pageLogin = require('../controllers/loginController');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const results = await pageLogin.login(email, password); // Await login function

        if (results.authenticated) {
            return res.status(200).json(results); // Success response
        } else {
            return res.status(401).json(results); // Unauthorized response
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


router.post('/signup', (req, res) => {
    try {
        const { email, username, password } = req.body;

        pageLogin.signup(email, username, password, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json(results);
        })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

})

router.post('/sendLink', (req, res) => {
    const { email } = req.body;

    pageLogin.sendLink(email, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        return res.status(200).json(results);
    })
})

router.post('/resetPassword', (req, res) => {
    const { password, resetToken } = req.body;

    pageLogin.resetPassword(password, resetToken, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    })
})

module.exports = router;