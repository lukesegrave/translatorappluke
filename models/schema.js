var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var translationSchema = new Schema({
    sentences: String,
    translation: []
})

var array = mongoose.model('array', translationSchema)

module.exports = array
