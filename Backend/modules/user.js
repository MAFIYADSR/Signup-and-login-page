const Sequelize = require('sequelize');
const sequelize = require('../utill/database');

const User = sequelize.define('users', {

    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }

})

module.exports = User;