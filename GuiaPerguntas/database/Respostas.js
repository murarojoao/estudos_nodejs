const { INTEGER } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("./database");

const Respostas = connection.define("respostas", {
    conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Respostas.sync({force: false});

module.exports = Respostas;