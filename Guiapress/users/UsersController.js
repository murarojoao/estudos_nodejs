const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/save", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({
        where: {email: email}
    }).then(user => {
        if(user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/admin/users/create")
                console.log(err);
            });
        } else {
            res.redirect("/admin/users/create", {alert: true});
        }
    });
});

router.get("/admin/users/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email =req.body.email;
    var password = req.body.password;
    
    User.findOne({where: {email: email}}).then(user => {
        if (user != undefined) {
        //password validation
        var correct = bcrypt.compareSync(password, user.password);

        if(correct) {
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect("/admin/articles");
        } else {
            res.redirect("/admin/users/login")
        }
        } else {
            res.redirect("/admin/users/login");
        }
    })
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;