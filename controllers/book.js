const Book = require('mongoose').model('Book');

function validateBook(bookArgs, req) {
    let errorMsg = '';
    if(!req.isAuthenticated()){
        errorMsg = 'You should be logged in to operate with books!'
    } else if (!bookArgs.title){
        errorMsg = 'Invalid information!';
    } else if (!bookArgs.content){
        errorMsg = 'Invalid information!';
    }

    return errorMsg;
}


module.exports = {
    createGet: (req, res) => {
        res.render('book/create');
    },

    createPost: (req, res) => {
        let bookArgs = req.body;
        console.log(req.body);
        let errorMsg = validateBook(bookArgs, req);

        if (errorMsg) {
            res.render('book/create', {error: errorMsg});
            return;
        }

        let music =req.files.music;
        if(music){
            let filename = music.name;

            music.mv(`./public/music/${filename}`, err=>{
                if(err){
                    console.log(err.message)
                }

            });
        }

        bookArgs.author = req.user.id;


        bookArgs.musicPath =`/music/${music.name}`
        Book.create(bookArgs).then(book => {
            req.user.books.push(book.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/user/booklist', {error: err.message});
                } else {
                    res.redirect('/user/booklist');
                }
            })
        })
    },

    details: (req, res) => {
        let id = req.params.id;

        Book.findById(id).populate('author').then(book => {



            res.render('book/details', book);
        })
    },
    editGet: (req, res) => {
        let id = req.params.id;
        if(!req.isAuthenticated()){
            let returnUrl = `/book/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Book.findById(id).then(book => {
            req.user.isInRole('Admin').then(isAdmin=>{
                if(!isAdmin && !req.user.isAuthor(book)){
                    res.redirect('/');
                    return;
                }
            })

            res.render('book/edit', book);
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;
        let bookArgs = req.body;

        let errorMsg = validateBook(bookArgs, req);

        if(errorMsg) {
            res.render('book/edit', { error: errorMsg});
            return;
        }

        Book.update({_id: id}, {$set: { title: bookArgs.title, content : bookArgs.content, bookAuthor: bookArgs.bookAuthor, year: bookArgs.year, genre: bookArgs.genre, comments: bookArgs.comments}}).then(err => {

            res.redirect(`/book/details/${id}`);
        });
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/book/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Book.findById(id).then(book => {
            req.user.isInRole('Admin').then(isAdmin=>{
                if(!isAdmin && !req.user.isAuthor(book)){
                    res.redirect('/');
                    return;
                }
                res.render('book/delete', book);
            })


        });
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Book.findByIdAndRemove(id).then(book => {
            let index = req.user.books.indexOf(book.id);
            req.user.books.splice(index, 1);
            req.user.save(err=>{
                if(err){
                    res.render('/user/booklist', { error: err.message});
                }else{
                    res.redirect('/user/booklist');
                }
            })
        });
    }
};