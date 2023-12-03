const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routers/route');
const sequelize = require("./util/database");

const app = express();

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Routes
app.use('/user', userRoute);

// 404 Middleware
app.use((req, res, next) => {
    console.log('404');
    res.status(404).json({ message: '404 Not Found' });
});

// Sync models with the database
sequelize.sync().then(() => {
    console.log('Server started on port 4000');
    app.listen(4000);
}).catch(err => {
    console.error('Error syncing with database:', err);
});
