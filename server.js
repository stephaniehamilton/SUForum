const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db


MongoClient.connect('mongodb://stephaniehamilton:stevenuniverse@ds015892.mlab.com:15892/stephsprojects', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) =>{
  db.collection('posts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {posts: result})

  })
})


app.post('/posts', (req, res) => {
  db.collection('posts').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/posts', (req, res) => {
  db.collection('posts').findOneAndUpdate({title: 'Steven Bombs'}, {
    $set: {
      author: req.body.name,
      title: req.body.title,
      link: req.body.link,
      words: req.body.text
    }

}, {
  sort: {_id: -1},
  upsert: true
}, (err, result) => {
  if (err) return res.send(err)
  res.send(result)
  })
})
