const mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    bookAuthor: {type: String, required: true},
    signature: {type: String, required: true},
    year:{type: String, required:true},
    genre: {type: String, required:true},
    format: {type: String, required:true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()},
    comments: {type: String },
    musicPath: {type:String}
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
