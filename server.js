const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const md5 = require('md5');
require("dotenv").config();

mongoose.connect("mongodb+srv://" + process.env.usernameMongoDB + ":" + process.env.password + "@cluster0.xgjts.mongodb.net/secretsDB", {useNewUrlParser: true, useUnifiedTopology: true})

const app = express();
const PORT = process.env.PORT || 3000;

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//  This is level 2 authentication configuration with mongoose-encryption
// userSchema.plugin(encrypt, {
//     secret: process.env.secret,
//     encryptedFields: ["password"]
// });

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")

.get(function(req, res) {
    res.render("login");
})

.post(function(req, res) {
    const email = req.body.email;
    const password = md5(req.body.password);

    User.findOne({ email: email}, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    res.send("Wrong password. Try again");
                }
            } else {
                res.send("No user found.");
            }
        }
    });
});

app.route("/register")

.get(function(req, res) {
    res.render("register");
})

.post(function(req, res) {
    const newUser = new User({
        email: req.body.email,
        password: md5(req.body.password)
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.render('secrets');
        }
    });
}); 

app.listen(PORT, function() {
    console.log('listening on port: ' + PORT);
});