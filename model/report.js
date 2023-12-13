const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const report=sequelize.define("reports",{
    fileUrl:{
        type:Sequelize.STRING,
        required:true
    }
})

module.exports=report;