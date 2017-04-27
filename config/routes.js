const userController = require('./../controllers/user');
const bookController = require('./../controllers/book');
const homeController = require('./../controllers/home');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/book/create', bookController.createGet);
    app.post('/book/create', bookController.createPost);

    app.get('/book/details/:id', bookController.details);


    app.get('/book/edit/:id', bookController.editGet);

    app.post('/book/edit/:id', bookController.editPost);

    app.get('/book/delete/:id', bookController.deleteGet);
    app.post('/book/delete/:id', bookController.deletePost);

    app.get('/user/details', userController.detailsGet);
    app.post('/user/details', userController.detailsPost); //home/index


    app.get('/user/help', userController.helpGet);
    app.post('/user/help', userController.helpPost);

    app.get('/user/booklist', userController.booklistGet); // Lbrary
    app.post('/user/booklist', homeController.index);

    app.get('/user/ourProject', userController.ourProjectGet);
    app.post('/user/ourProject', userController.ourProjectPost);




};

