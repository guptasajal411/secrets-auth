const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect("mongodb+srv://" + process.env.usernameMongoDB + ":" + process.env.password + "@cluster0.xgjts.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})

const app = express();
const PORT = process.env.PORT || 3000;

const userSchema = {
    email: String,
    passowrd: String
}

const User = new mongoose.Model("User", userSchema);

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
    const newUser
})

app.listen(PORT, function() {
    console.log('listening on port: ' + PORT);
});