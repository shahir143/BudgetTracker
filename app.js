const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoute = require('./routers/user');
const expenseRoute=require('./routers/expense')
const purchaseRoute=require('./routers/purchase')
const premiumRoute=require('./routers/premium')
const resetRoute = require('./routers/reset');

const sequelize = require("./util/database");
const expense=require('./model/expense');
const loginUser =require('./model/login');
const order = require('./model/order');
const reset=require('./model/reset');

const app = express();

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Routes
app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password',resetRoute);
loginUser.hasMany(expense);
expense.belongsTo(loginUser);

loginUser.hasMany(order)
order.belongsTo(loginUser)

loginUser.hasMany(reset)
reset.belongsTo(loginUser)

// 404 Middleware
app.use((req, res, next) => {
    res.send('<h4>page not found</h4>')
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
