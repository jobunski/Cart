var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');

var Product = require('../models/product');

//
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize))
            return res.render('shop/index', {title: 'Shopping Cart', products: productChunks});
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
    if (req.session.cart) {
        var cart = new Cart(req.session.cart);
        res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
    } else {
        return res.render('shop/shopping-cart', {products: null});
    }
});

module.exports = router;
