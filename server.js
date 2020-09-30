const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to mongoDB
connectDB();

// Initialise middleware (express.json)
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`** Server is up and running on port ${PORT} **`)
);
