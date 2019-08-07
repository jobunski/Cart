var Product = require('../models/product');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true});
var product = [
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1457545195570-67f207084966?ixlib=rb-1.2.1&auto=format&fit=crop&w=1369&q=80',
        title: 'Scarfs',
        description: 'Woolen knitted scarfs!',
        price: 300
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1483103068651-8ce44652c331?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        title: 'Baseball cap',
        description: 'Summer themed baseball coat',
        price: 200
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1457545195570-67f207084966?ixlib=rb-1.2.1&auto=format&fit=crop&w=1369&q=80',
        title: 'Scarfs',
        description: 'Woolen knitted scarfs!',
        price: 300
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1483103068651-8ce44652c331?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        title: 'Baseball cap',
        description: 'Summer themed baseball coat',
        price: 200
    })
]

var done = 0;
for (var i = 0; i < product.length; i++) {
    product[i].save(function (err, result) {
        done++;
        if (done === product.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
