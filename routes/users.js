var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

//Get to the users profile
router.get('/profile', userAuthenticated, function (req, res, next) {
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            return res.write('Error')
        }
        var cart;
        orders.forEach(function (order) {

            cart = new Cart(order.cart);
            order.items = cart.generateArray();

        });
        res.render('user/profile', {orders: orders});
    });
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
    // res.render('user/signup', {messages: messages, hasErrors: messages.length > 0});
    res.render('user/signup', {csrfToken: req.csrfToken()});
});

router.post('/signup', passport.authenticate('local-signup', {
        failureRedirect: '/user/signup',
        failureFlash: true
    }
), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);

    } else {
        res.redirect('/user/profile')
    }

});

//Get to the signin page
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local-signin', {
        failureRedirect: '/user/signin',
        failureFlash: true
    }
), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }

});

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
        return next()
    }
    return res.redirect('/')
}