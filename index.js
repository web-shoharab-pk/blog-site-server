const express = require('express')
const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5500
require('dotenv').config()

app.use(express.json())
app.use(cors())


var serviceAccount = require("./blog-site-38a73-firebase-adminsdk-b813g-197e76ba77.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/${process.env.DB_DATA}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_BLOG_COLLECTION}`);
  const adminCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_ADMIN_COLLECTION}`);
  const userCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_USER_COLLECTION}`);
  const writerCollection = client.db(`${process.env.DB_DATA}`).collection(`${process.env.DB_CONTENT_WEITER_COLLECTION}`);
  app.get('/', (req, res) => {
    console.log(uri)
    res.send('Hello World! I am a blogsite api')
  })

  app.post('/addBlogsWriter', (req, res) => {
    const data = req.body;
    writerCollection.insertOne(data)
      .then((result) => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addanAdmin', (req, res) => {
    const data = req.body;
    adminCollection.insertOne(data)
      .then((result) => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })


  app.post('/addBlog', (req, res) => {
    const data = req.body;
    blogCollection.insertOne(data)
      .then((result) => {
        res.send(result.insertedCount > 0)
      })
  })


  app.post('/collectUsers', (req, res) => {
    const data = req.body;
    // userCollection.insertOne(data)
    //   .then((result) => {
    //     console.log(result)
    //     res.send(result.insertedCount > 0)
    //   }) 
  })


  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
  })


  app.post('/isWriter', (req, res) => {
    const email = req.body.email;
    writerCollection.find({ email: email })
      .toArray((err, writer) => {
        res.send(writer.length > 0)
      })
  })


  app.get('/allBlogs', (req, res) => {
    blogCollection.find({})
      .toArray((err, blogs) => {
        res.send(blogs)
      })
  })


  app.get('/myBlogs', (req, res) => {
    const bearer = req.headers.authorization
    console.log(req.query.email)
    if (bearer && bearer.startsWith('Bearer ')) {
      const jwtToken = bearer.split(' ')[1]
      // console.log(jwtToken)
      admin
        .auth()
        .verifyIdToken(jwtToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          console.log(tokenEmail)
          if(tokenEmail == req.query.email) {
            blogCollection.find({blogerEmail: req.query.email})
            .toArray((err, result) => {
              res.send(result)
            })
          } 
        })
        .catch((error) => {
          // Handle error
        });
    }
  })


});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})