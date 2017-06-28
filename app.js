//telling it to use mongoose, express & body parser)

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/translator')
array = require('./models/schema.js')

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());


//main page **DONE**
app.get('/', (req, res) => {
  array.find({}, (err, done) => {
    if (err) return console.log('error', err)
    res.render('index.ejs', {
      done
    })
  })
})


//Create a new sentence **DONE**
app.post('/sentences', function(req, res) {
  var sentences = req.body.sentences

  array.create({
    sentences: sentences
  }, (err, done) => {
    if (err) return console.log('error', err)
  })
  res.redirect('/')
})



//Show Updated Phrase form **DONE**
app.get('/sentences/:sentence/update', (req, res) => {
  var sentence = req.params.sentence
  array.findOne({
    _id: sentence
  }, (err, done) => {
    if (err) return console.log('error', err)
    res.render('updateform.ejs', {
      done
    })
  })
})


//Update a sentence **DONE**
app.post('/sentences/:sentence/update', function(req, res) {
  var oldSentence = req.params.sentence
  var newSentence = req.body.newSentence

  array.findOneAndUpdate({
    _id: oldSentence
  }, {
    $set: {
      sentences: newSentence
    }
  }, (err, done) => {
    if (err) {
      return console.log('cant find id')
    }
    res.redirect('/')
  })
})


//Delete a sentence **DONE**
app.post('/sentences/:sentence/delete', function(req, res) {
  var sentenceToDelete = req.params.sentence

  array.findByIdAndRemove({
    _id: sentenceToDelete
  }, (err, done) => {
    if (err) {
      return console.log('cant find to delete')
    }
    res.redirect('/')
  })
})


//Add Translation Form **DONE**
app.get('/sentences/:sentence/translate', (req, res) => {
  var sentence = req.params.sentence
  array.findOne({
    _id: sentence
  }, (err, done) => {
    if (err) return console.log('error', err)
    res.render('addtranslationform.ejs', {
      done
    })
  })
})


//Add a Translation (with Lang Code) **DONE**
app.post('/sentences/:sentence/translate', function(req, res) {
  var oldTranslation = req.params.sentence
  var newTranslation = req.body.translation
  var newLanguage = req.body.lang

  array.findOne({
    _id: oldTranslation
  }, (err, done) => {
    if (err) return console.log('error', err)
    done.translation.push({
      language: newLanguage,
      translations: newTranslation
    })
    done.save((err) => {
      if (err) return console.log('error', err)
    })
  })
  res.redirect('/')
})



//Delete Translation for given language **DONE**
app.post('/sentences/:sentence/delete/:lang', function(req, res) {
  var oldTranslation = req.params.sentence
  var langToDelete = req.params.lang

  array.findOne({
    _id: oldTranslation
  }, (err, done) => {
    if (err) return console.log('error', err)
    for (var x in done.translation) {
      if (done.translation[x].language == langToDelete) {
        done.translation.splice(x, 1)
      }
    }
    done.save((err, yeah) => {
      if (err) return console.log('error', err)
      console.log('saved', yeah)
    })
    res.redirect('/')
  })
})



//Add Update Translation Form **DONE**
app.get('/sentences/:sentence/update/:lang', function(req, res) {
  var sentence = req.params.sentence
  var language = req.params.lang
  var translation = req.body.updateTranslation

  array.findOne({
    _id: sentence
  }, (err, done) => {
    if (err) return console.log('error', err)
    res.render('updatedtranslationform.ejs', {
      done,
      language,
      translation
    })
  })
})


//Update a Translation **DONE**
app.post('/sentences/:sentence/update/:lang', function(req, res) {
  var oldSentence = req.params.sentence
  var oldLan = req.params.lang
  var newTranslation = req.body.updateTranslation

  array.findOne({
    _id: oldSentence
  }, (err, done) => {
    if (err) return console.log('error', err)
    for (var x in done.translation) {
      if (done.translation[x].language == oldLan) {
        done.translation.splice(x, 1)
        done.translation.push({
          language: oldLan,
          translations: newTranslation
        })
      }
    }
    done.save((err, yeah) => {
      if (err) return console.log('error', err)
      console.log('saved', yeah)
    })
    console.log('!!!!!!', done)
    res.redirect('/')
  })
})



//running the server in port 3001
app.listen(port, function() {
  console.log("Express server running on port ", port)
})
