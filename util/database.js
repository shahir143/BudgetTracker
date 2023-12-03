const Sequelize=require('sequelize');
const sequelize=new Sequelize('expensive-Tracker','root','root',{
    dialect:'mysql',
    host:'localhost',
})

module.exports = sequelize;