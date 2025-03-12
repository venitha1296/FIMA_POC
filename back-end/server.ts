// server.ts
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require("./config/database");  // Importing using require

const app = express();

// Establish database connection
connectDB();

app.use(cors());
app.use(bodyParser.json());

const loginRouter = require('./routes/loginRoutes');
const checkAuthHeader = require('./middlewares/authMiddleware');

app.use('/api', loginRouter);
app.use('/exports', express.static(path.join(__dirname, '../exports')));

const port = process.env.PORT || 3001;  // Ensure a fallback for port if not set
app.listen(port, () => {
  console.log('Server started on port ' + port);
});
