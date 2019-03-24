const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-eshop', 'root', 'mysql', {
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;