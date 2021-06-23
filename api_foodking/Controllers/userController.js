const express =require('express')
var router=express.Router()
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID


MongoClient.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.n7d7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  // Declare Database
  const db = client.db('food')
  // DEclare Name og Collections
  const Users = db.collection('users')
  const Products = db.collection('products')


  //Users APi

  // Add New User
  router.route("/add").post((req, res)=>{
    Users.insertOne(req.body)
    .then(result => {
      console.log(result)
      res.send('Document bien inserer')
    })
    .catch(error => console.error(error))
  })

  // Get ALL users
  router.route("/").get((req, res)=>{
    Users.find().toArray()
    .then(results => {
      console.log(results)
      res.json(results)
    })
    .catch(error => console.error(error))
  })

  // Get Count ALL users
  router.route("/CountUsers").get((req, res)=>{
    Users.countDocuments()
    .then(results => {
      console.log(results)
      res.json({count: results})
    })
    .catch(error => console.error(error))
  })

  // Check user
  router.route("/UserExist").post((req, res)=>{
    Users
    .countDocuments( { login : req.body.login,password : req.body.password }, (err, count) => {
        res.json({count: count})
    });
  })

  // Update user by Id
  router.put('/:id', async (req, res) => {
    Users.findOneAndUpdate(
      {'_id':ObjectId(req.params.id)},
      {
        $set: {
          nom: req.body.nom,
          prenom: req.body.prenom,
          email: req.body.email,
          adresse: req.body.adresse,
          telephone: req.body.telephone,
          ville: req.body.ville,
          login: req.body.login,
          password: req.body.password,
        }
      },
      {
        upsert: true
      }
    )
    .then(response => {
      if (response.ok) res.json("success")
    })
      .catch(error => console.error(error))
  });

  // Delete user by id
  router.delete('/:id', (req, res) => {
    Users.deleteOne(
      {'_id':ObjectId(req.params.id)}
    )
      .then(result => {
        res.json(`Deleted`)
      })
      .catch(error => console.error(error))
  })


})

module.exports=router