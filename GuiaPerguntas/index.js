const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const Perguntas = require("./database/Perguntas.js");
const Respostas = require("./database/Respostas.js");
const app = express();

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
//Converte os dados enviados pelo formulário em estrutura javascript utilizável no back-end

app.get("/", (req, res) => {
    Perguntas.findAll({raw: true, order: [
        ['id','DESC']
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
});
// o findAll funciona em forma de um SELECT * FROM perguntas
// raw: true é responsável por retornar apenas os dados essenciais (dados das colunas das tabelas)  
// order é responsável por definir a ordenação da exibição das perguntas

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarPergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Perguntas.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    })
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;

    Perguntas.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) {
            Respostas.findAll({where: {perguntaId: pergunta.id} , order: [
                ['id','DESC']
            ]}).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect('/');
        }
    });
});

app.post("/responder", (req, res) => {
    var conteudo = req.body.conteudo;
    var perguntaId = req.body.perguntaId;

    Respostas.create({
        conteudo: conteudo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(8080, () => {
    console.log("App rodando.");
});