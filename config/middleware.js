const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require("cookie-parser");
module.exports = function(app) {
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(cookieParser())
    //Express Session
    app.use(session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true,
    }))
}