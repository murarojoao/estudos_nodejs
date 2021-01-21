const Sequelize = require("sequelize");
const connection = require("./database");

const Perguntas = connection.define('perguntas', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Perguntas.sync({force: false}).then(() => {});
// Cria a tabela caso ela não exista. "force: false" para que, caso ela já exista, ela não seja recriada 

module.exports = Perguntas;