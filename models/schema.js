var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var translationSchema = new Schema({
    sentences: String,
    translation: []
})

var translations = mongoose.model('translations', translationSchema)

module.exports = translations
