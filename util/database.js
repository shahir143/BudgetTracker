const Sequelize=require('sequelize');

const tableName=process.env.AWS_DB_NAME;
const userName=process.env.AWS_DB_USERNAME;
const userPassword=process.env.AWS_DB_PASSWORD;
const dialect = process.env.AWS_DB_DIALECT;
const db_host=process.env.AWS_DB_HOST;
const sequelize=new Sequelize(tableName,userName,userPassword,{
    dialect:dialect,
    host:db_host,
})

module.exports = sequelize;
