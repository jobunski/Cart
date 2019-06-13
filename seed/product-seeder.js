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
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
    }),
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1474031317822-f51f48735ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title: 'Hoodie',
        description: 'DUde under the hood. A Boogie with a hoodie!',
        price: 500
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
