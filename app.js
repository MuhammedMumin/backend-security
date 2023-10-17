//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

console.log(process.env.API_KEY)

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home")
});

app.get("/login", function(req, res){
    res.render("login")
});

app.get("/register", function(req, res){
    res.render("register")
});



app.post('/register', function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
 
    newUser.save()
        .then(() => {
            res.render('secrets');
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send('Bad request');

        });
});
 
app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
 
    User.findOne({ email: username })
    .then((foundUser) => {
        if (foundUser && foundUser.password === password) {
            res.render('secrets');
        } else {
            console.log("User not found or password is incorrect");
            res.status(400).send('Bad request');
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send('Internal Server Error');
    });

});






app.listen(5000, function() {
    console.log("Server started on port 5000.");
});