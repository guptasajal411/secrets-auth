const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect("mongodb+srv://" + process.env.usernameMongoDB + ":" + process.env.password + "@cluster0.xgjts.mongodb.net/secretsDB", {useNewUrlParser: true, useUnifiedTopology: true})

const app = express();
const PORT = process.env.PORT || 3000;

const userSchema = {
    email: String,
    password: String
}

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.route("/register")
.get(function(req, res) {
    res.render("register");
})
.post(function(req, res) {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
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