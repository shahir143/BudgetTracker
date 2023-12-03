const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const user=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userName:{
        type:Sequelize.STRING,
    },
    userEmail:{
        type:Sequelize.STRING,
    },
    userPassword:{
        type:Sequelize.STRING,
    }
})

module.exports=user;