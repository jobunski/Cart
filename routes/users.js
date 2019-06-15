var express = require('express');
var router = express.Router();
//var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

//Get to the users profile
router.get('/profile', userAuthenticated, function (req, res, next) {
    res.render('user/profile');
});

//Logging out
router.get('/logout', userAuthenticated, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});


// Get to the signup page
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {messages: messages, hasErrors: messages.length > 0});
    // res.render('user/signup'/*{csrfToken: req.csrfToken()}*/);
});

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/user/signup',
        failureFlash: true
    }
));

//Get to the signin page
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true
    }
));

module.exports = router;

function userAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/');
    }
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next()
    }
    return res.redirect('/')
}