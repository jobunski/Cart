var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');

//
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize))
            return res.render('shop/index', {
                title: 'Shopping Cart', products: productChunks,
                successMsg: successMsg, noMessgae: !successMsg
            });
        }
    });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    console.log('I am about to break');
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/')
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/shopping-cart', function (req, res, next) {
    console.log(req.session.cart);
    // res.render('shop/cartdemo');
    if (req.session.cart) {
        var cart = new Cart(req.session.cart);
        res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
    } else {
        return res.render('shop/shopping-cart', {products: null});
    }
});

router.get('/checkout', userAuthenticated, function (req, res, next) {

    if (!req.session.cart) {
        res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {
        csrfToken: req.csrfToken(),
        totalPrice: cart.totalPrice,
        errMsg: errMsg,
        Noerror: !errMsg
    });
});


router.post('/checkout', userAuthenticated, function (req, res, next) {
    if (!req.session.cart) {
        res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    const stripe = require("stripe")("sk_test_bKvNX9FU2tX19jlzQRa0Xhfj00IJs52LeA");

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        // asynchronously called
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (err, result) {

            req.flash('success', 'Successfully bought product');
            req.session.cart = null;
            res.redirect('/');
        });

    });
});

module.exports = router;

function userAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.oldUrl = req.url;
        return res.redirect('/user/signin');
    }
}

