var express = require('express');
var router = express.Router();
//var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

//Get to the users profile
router.get('/profile', function (req, res, next) {
    res.render('user/profile');
});

// router.use('/', notLoggedIn, function (req, res, next) {
//     next();
// });


// Get to the signup page
router.get('/signup', function (req, res, next) {
    res.render('user/signup'/*{csrfToken: req.csrfToken()}*/);
});

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/user/signup',
        failureFlash: true
    }
));

//Get to the signin page
router.get('/signin', function (req, res, next) {
    res.render('user/signin'/*{csrfToken: req.csrfToken()}*/);
});

router.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true
    }
));

//Logging out
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.headers);
        return next();
    }
    res.end();
    console.log(req.headers);
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next()
    }
    return res.redirect('/')
}