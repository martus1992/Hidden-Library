const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');
const encryption = require('./../utilities/encryption');

const mongoose = require('mongoose');
const Book = mongoose.model('Book');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost:(req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let roles = [];
                Role.findOne({name: 'User'}).then(role =>{
                    roles.push(role.id);

                    let userObject = {
                        email: registerArgs.email,
                        passwordHash: passwordHash,
                        fullName: registerArgs.fullName,
                        maleOrFemale:registerArgs.maleOrFemale,
                        birth:registerArgs.birth,
                        salt: salt,
                        roles: roles
                    };
                    User.create(userObject).then(user => {
                        role.users.push(user.id);
                        role.save(err=>{
                            if(err){
                                res.render('user/register', {error: err.message})
                            }else{
                                req.logIn(user, (err) => {
                                    if (err) {
                                        registerArgs.error = err.message;
                                        res.render('user/register', registerArgs);
                                        return;
                                    }

                                    res.redirect('/');
                                })

                            }
                        });


                    })
                });




            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({email: loginArgs.email}).then(user => {
            if (!user ||!user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

                let returnUrl = '/';
                if(req.session.returnUrl) {
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl;
                }

                res.redirect(returnUrl);
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },
    details:(req, res) =>{

        res.render('home/index');

        res.redirect('/');
    },

    helpGet: (req, res) =>{
        res.render('user/help')
    },
    helpPost: (req, res) =>{
        res.render('user/help')
    },

    booklistGet: (req, res) =>{
        Book.find({}).limit(6).populate('author').then(books => {
            res.render('user/booklist',{books: books});
        })
    },
    booklistPost: (req, res) =>{
        Book.find({}).limit(6).populate('author').then(books => {
            res.render('user/booklist',{books: books});
        })
    },


    ourProjectGet: (req, res) =>{
        res.render('user/ourProject')
    },

    ourProjectPost: (req, res) =>{
        res.render('user/ourProject')
    },

    detailsGet: (req, res) =>{
        res.render('user/details')
    },

    detailsPost: (req, res) =>{
        res.render('user/details')
    }


};
