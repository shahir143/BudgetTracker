const express=require('express');
const route=express.Router();
const premiumRoute=require('../controllers/premium');
const authorize=require('../middleware/authorize');

route.get('/leaderboard',authorize.authorizationToken,premiumRoute.showLeaderBoard)

module.exports=route;