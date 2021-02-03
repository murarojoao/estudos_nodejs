const { response } = require("express");
const express = require("express");
const router = express.Router();
const Category = require("./Category.js");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("./admin/categories/index", {categories: categories});
    });
});

router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("./admin/categories/new");
});

router.post("/categories/save", adminAuth, (req, res) => {
    var title = req.body.title;
 
    if(title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title.toLowerCase())
        }).then(() => {
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories/new");
    }
});

router.post("/categories/delete", adminAuth, (req, res) => {
    var id = req.body.id;

    if(id != undefined) {
        if(id != isNaN) {
            Category.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/admin/categories");
            });
        } else {
            res.redirect("/admin/categories");
        }
    } else {
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if (category != undefined){
            res.render("./admin/categories/edit", {category: category});
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(error => {
        res.redirect("/admin/categories");
        console.log(error);
    });
});

router.post("/admin/categories/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title.toLowerCase())}, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories");
    });
});

module.exports = router;
