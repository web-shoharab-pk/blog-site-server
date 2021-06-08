const express = require('express')
const app = express();
var cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = 5500
require('dotenv').config()

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/${process.env.DB_DATA}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_BLOG_COLLECTION}`);
  const adminCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_ADMIN_COLLECTION}`);
  const userCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_USER_COLLECTION}`);
  const writerCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_CONTENT_WEITER_COLLECTION}`);
  app.get('/', (req, res) => {
    console.log(uri)
    res.send('Hello World!')
  })

  app.post('/addBlogsWriter', (req, res) => {
    const data = req.body;
    writerCollection.insertOne(data)
      .then((result) => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
    console.log(data)
  })

  app.post('/addanAdmin', (req, res) => {
    const data = req.body;
    adminCollection.insertOne(data)
      .then((result) => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
    console.log(data)
  })


  app.post('/addBlog', (req, res) => {
    const data = req.body;
    blogCollection.insertOne(data)
      .then((result) => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
    console.log(data)
  })


  app.post('/collectUsers', (req, res) => {
    const data = req.body;
    userCollection.insertOne(data)
      .then((result) => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
    console.log(data)
  })


  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
    console.log(email)
  })


  app.post('/isWriter', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, writer) => {
        res.send(writer.length > 0)
      })
    console.log(email)
  })


});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})