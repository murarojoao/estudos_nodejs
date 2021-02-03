const express = require("express");
const app = express();
const session = require("express-session");
const connection = require("./database/database.js");
const bodyParser = require("body-parser");

const categoriesController = require("./categories/CategoriesController.js");
const articlesController = require("./articles/ArticlesController.js");
const usersController = require("./users/UsersController.js");

const Category = require("./categories/Category.js");
const Article = require("./articles/Article.js");
const User = require("./users/User.js");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 30000000}
}));

connection.
    authenticate()
    .then(() => {
        console.log("Conexão com o banco de dados realizada com sucesso.");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get("/article/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {slug: slug}
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {slug: slug},
        include: [{model: Article}]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})


app.listen (8080, () => {
    console.log("Servidor rodando");
});