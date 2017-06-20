var express = require('express'),
    //requiring express
    app = express(),
    //assigning express executed as a function to the variabl app
    bodyParser = require('body-parser');
//requiring body-parserz
//body parser set-up (always the same)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

//main page
var array = []
app.get('/', (req, res) => {
    res.render('index.ejs', {
        array
    })
})

//Create a new sentence
app.post('/sentences', function (req, res) {
    var sentences = req.body.sentences
    var obj = {
        sentences: sentences,
        translation: []
    }
    array.push(obj)
    res.render('index.ejs', {
        array
    })
})

//Show Updated Phrase form
app.get('/sentences/:sentence/update', function (req, res) {
    var sentence = req.params.sentence
    res.render('updateform.ejs', {
        sentence
    })
})


//Update a sentence
app.post('/sentences/:sentence/update', function (req, res) {
    var oldSentence = req.params.sentence
    var newSentence = req.body.newSentence

    for (var x in array) {
        if (array[x]['sentences'] == oldSentence) {
            var newObj = {
                sentences: newSentence,
                translation: []
            }
            delete array[x]
            array.push(
                newObj)
            res.render('index.ejs', {
                array
            })
        }
    }
})


//Delete a sentence
app.post('/sentences/:sentence/delete', function (req, res) {
    var sentenceToDelete = req.params.sentence
    for (var x in array) {
        if (array[x]['sentences'] == sentenceToDelete) {
            console.log(array[x])
            delete array[x]
            res.render('index.ejs', {
                array
            })
        }
    }
})


//Add Translation Form
app.get('/sentences/:sentence/translate', function (req, res) {
    var sentence = req.params.sentence
    res.render('addtranslationform.ejs', {
        sentence
    })
})

//Add a Translation (with Lang Code)
app.post('/sentences/:sentence/translate', function (req, res) {
    var oldTranslation = req.params.sentence
    var newTranslation = req.body.translation
    var newLanguage = req.body.lang
    //need to add in array[0][translations] so I can push to it
    for (var x in array) {
        if (array[x]['sentences'] == oldTranslation) {
            var newLangObj = {
                language: newLanguage,
                translation: newTranslation
            }
            array[x]['translation'].push(newLangObj)
            res.render('index.ejs', {
                array
            })
        }
    }
})


//Delete Translation for given language
app.post('/sentences/:sentence/delete/:lang', function (req, res) {
    var oldTranslation = req.params.sentence
    var langToDelete = req.params.lang

    for (var x in array) {
        for (var y in array[x]['translation']) {
            if (array[x]['translation'][y]['language'] === langToDelete) {
                delete(array[x]['translation'][y])
            }
        }
    }
    res.render('index.ejs', {
        array
    })
})


//Add Update Translation Form
app.get('/sentences/:sentence/update/:lang', function (req, res) {
    var sentence = req.params.sentence
    var language = req.params.lang
    var newTranslation = req.body.updateTranslation
    res.render('updatedtranslationform.ejs', {
        sentence,
        language
    })
})



//Update a Translation
app.post('/sentences/:sentence/update/:lang', function (req, res) {
    var oldSentence = req.params.sentence
    var oldLan = req.params.lang
    var newTranslation = req.body.updateTranslation

    for (var x in array) {
        for (var y in array[x]['translation']) {
            if (array[x]['translation'][y]['language'] === oldLan)
                array[x]['translation'][y]['translation'] = newTranslation
        }
    }
    res.render('index.ejs', {
        array
    })
})








//running the server in port 3001
app.listen(3001, function () {
    console.log("Express server running on port 3001")
})
