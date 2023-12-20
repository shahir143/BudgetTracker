const express=require('express');
const route=express.Router();
const controllerLogin=require('../controllers/login');

route.get('/signup',controllerLogin.signupPage);
route.post('/signup',controllerLogin.signup);
route.get('/login',controllerLogin.loginPage);
route.post('/login',controllerLogin.login);
route.get('/',contro)

module.exports=route;
