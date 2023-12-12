const express=require('express');
const route=express.Router();

const resetController=require('../controllers/reset');

route.post('/resetpassword',resetController.resetPassword);

module.exports=route;