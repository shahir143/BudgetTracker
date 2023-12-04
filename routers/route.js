const express=require('express');
const route=express.Router();
const controllerLogin=require('../controllers/login');

route.post('/signup',controllerLogin.signup);
route.post('/login',controllerLogin.login);


module.exports=route;