require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const userEnteredEmail = req.body.username;
        const userEnteredPassword = md5(req.body.password);
        User.findOne({ email: userEnteredEmail }, (err, foundItem) => {
            if (err) {
                console.log(err);
            } else {
                if (foundItem) {
                    if (foundItem.password === userEnteredPassword) {
                        res.render("secrets");
                    } else { res.send("Invalid password"); }
                } else {
                    res.send("Invalid Email");
                }
            }
        });
    });

app
    .route('/register')
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        });
        newUser.save((err) => {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });




app.listen(3000, function () {
    console.log("Server started on port 3000");
});