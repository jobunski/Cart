var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var flash = require('connect-flash');

passport.serializeUser(function (user, done) {
    return done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        return done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4});
        let errors = req.validationErrors();
        if (!errors) {
            User.findOne({'email': email}, function (err, user) {
                // console.log('I made it here');
                // console.log(JSON.stringify(req.body));
                if (err) {
                    return done(err)
                }
                if (user) {
                    return done(null, false, {message: 'Email is already used'})
                }
                var newUser = new User();
                newUser.email = email;
                newUser.password = newUser.encryptPassword(password);
                newUser.save(function (err, result) {
                    if (err) {
                        return done(err)
                    }
                    return done(null, newUser);
                });
            });
        } else {
            let messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('errors', messages));
        }
    }
));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid Password').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            let messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        User.findOne({'email': email}, function (err, user) {
            // console.log('I made it here');
            // console.log(JSON.stringify(req.body));
            if (err) {
                return done(err)
            }
            if (!user || !user.validPassword(password)) {
                return done(null, false, {message: 'Invalid email or password'})
            }
            return done(null, user);
        });
    }
));