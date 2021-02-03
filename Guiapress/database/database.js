const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress', 'root', '12345', {
    timezone: '-03:00',
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;