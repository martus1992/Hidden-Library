const Article = require('mongoose').model('Article');

function validateArticle(articleArgs, req) {
    let errorMsg = '';
    if(!req.isAuthenticated()){
        errorMsg = 'You should be logged in to operate with articles!'
    } else if (!articleArgs.title){
        errorMsg = 'Invalid information!';
    } else if (!articleArgs.content){
        errorMsg = 'Invalid information!';
    }

    return errorMsg;
}


module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },

    createPost: (req, res) => {
        let articleArgs = req.body;
        console.log(req.body);
        let errorMsg = validateArticle(articleArgs, req);

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
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

        articleArgs.author = req.user.id;
        

        articleArgs.musicPath =`/music/${music.name}`
        Article.create(articleArgs).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            })
        })
    },

    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {



            res.render('article/details', article);
        })
    },
    editGet: (req, res) => {
        let id = req.params.id;
        if(!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin=>{
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                    return;
                }
            })

            res.render('article/edit', article);
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;
        let articleArgs = req.body;

        let errorMsg = validateArticle(articleArgs, req);

        if(errorMsg) {
            res.render('article/edit', { error: errorMsg});
            return;
        }

        Article.update({_id: id}, {$set: { title: articleArgs.title, content : articleArgs.content, bookAuthor: articleArgs.bookAuthor, year: articleArgs.year, genre: articleArgs.genre, comments: articleArgs.comments}}).then(err => {

            res.redirect(`/article/details/${id}`);
        });
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin=>{
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                    return;
                }
                res.render('article/delete', article);
            })


        });
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Article.findByIdAndRemove(id).then(article => {
            let index = req.user.articles.indexOf(article.id);
            req.user.articles.splice(index, 1);
            req.user.save(err=>{
                if(err){
                   res.render('/', { error: err.message});
                }else{
                    res.redirect('/');
                }
            })
        });
    }
};