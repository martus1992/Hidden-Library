const mongoose = require('mongoose');
const Book = mongoose.model('Book');

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    }
};