const express=require('express');
const route=express.Router();
const controllerExpense=require('../controllers/expense');
const userAuthorization=require('../middleware/authorize');

route.delete('/delExpense/:id',userAuthorization.authorizationToken,controllerExpense.deleteData);
route.post('/addExpense',userAuthorization.authorizationToken,controllerExpense.saveData);
route.get('/Expenses',userAuthorization.authorizationToken, controllerExpense.getData);


module.exports=route;