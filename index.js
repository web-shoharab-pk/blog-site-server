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
  app.get('/', (req, res) => {
      console.log(uri)
    res.send('Hello World!')
  })
  // perform actions on the collection object
  
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})