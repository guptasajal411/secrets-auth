const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
//  This is level 2 authentication configuration with mongoose-encryption
// const encrypt = require("mongoose-encryption");
// This is a level 3 authentication method with md5 hashing
// const md5 = require('md5');
// level 4 authentication with bcrypt salting and hashing
// const bcrypt = require("bcrypt");
// const saltRounds = 10; //defining number of rounds for salting the password when hashing with bcrypt
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

//  This is level 2 authentication configuration with mongoose-encryption
// userSchema.plugin(encrypt, {
//     secret: process.env.secret,
//     encryptedFields: ["password"]
// });

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Level 5 authentication
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // initializes passport
app.use(passport.session()); // starts up passport

mongoose.connect("mongodb+srv://" + process.env.usernameMongoDB + ":" + process.env.password + "@cluster0.xgjts.mongodb.net/secretsDB", { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
});

app.route("/login")

    .get(function (req, res) {
        res.render("login");
    })

    .post(function (req, res) {

    });

app.route("/register")

    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {
        User.register({ username: req.body.email }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets");
                });
            }
        });
    });

app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()){
        res.render("secrets"); 
    } else {
        res.redirect("/login");
    }
});

app.listen(PORT, function () {
    console.log('listening on port: ' + PORT);
});