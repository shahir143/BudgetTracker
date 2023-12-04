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
        allowNull:false
    },
    userEmail:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    userPassword:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports=user;