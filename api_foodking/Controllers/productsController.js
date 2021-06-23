const express =require('express')
var router=express.Router()
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');


MongoClient.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.n7d7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  // Declare Database
  const db = client.db('food')
  // DEclare Name og Collections
  const Products = db.collection('products')

  //            Products APi
  
  // Get All product
  router.route("/").get((req, res)=>{
    Products.find().toArray()
    .then(results => {
      console.log(results)
      res.json(results)
    })
    .catch(error => console.error(error))
  })

  router.route("/add").post((req, res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.image.path;
      var newpath = __dirname+'/../../frontend/public/images/' + files.image.name;
      name_image=files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        console.log('File uploaded and moved!');
        fields['image']=files.image.name
        Products.insertOne(fields)
        .then(result => {
          console.log(result)
          res.send('Document bien inserer')
        })
        .catch(error => console.error(error))
      });
    });
    
  })


  router.delete('/:id', (req, res) => {
    Products.deleteOne(
      {'_id':ObjectId(req.params.id)}
    )
      .then(result => {
        res.json(`Deleted`)
      })
      .catch(error => console.error(error))
  })

  
  

})

module.exports=router