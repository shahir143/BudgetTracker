const Sequelize=require('sequelize');
const schema=process.env.DB_NAME;
const userName=process.env.DB_USERNAME;
const userPassword=process.env.DB_PASSWORD;
const db_host=process.env.DB_HOST;
const dialect=process.env.DB_DIALECT;

const sequelize=new Sequelize(schema,userName,userPassword,{
    dialect:dialect,
    host:db_host,
})

module.exports = sequelize;
