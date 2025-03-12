// authMiddleware.js

const jwt = require('jsonwebtoken');

function checkAuthHeader(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const authType = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (authType === 'Basic' && token !== process.env.TRU_API_TOKEN) { // via api
        return res.status(401).json({ error: 'Unauthorized' });
    } else if (authType === 'Bearer') { // via web login
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const nowInMillis = Date.now();
            const nowInSeconds = Math.floor(nowInMillis / 1000);

            req.user = decoded;
            if (!decoded.exp || decoded.exp === '' || nowInSeconds > decoded.exp) {
                // token no expire date OR empty OR expired
                return res.status(401).json({ error: 'Unauthorized' });
            }
        });
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next(); // Proceed to the next middleware or route handler
}

// echo -n "username:password" | base64

module.exports = checkAuthHeader;
