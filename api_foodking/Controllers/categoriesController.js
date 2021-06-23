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
  const categories = db.collection('category')


  //categories APi

  // Add New category
  router.route("/add").post((req, res)=>{
    categories.insertOne(req.body)
    .then(result => {
      console.log(result)
      res.send('Document bien inserer')
    })
    .catch(error => console.error(error))
  })

  // Get ALL category
  router.route("/").get((req, res)=>{
    categories.find().toArray()
    .then(results => {
      console.log(results)
      res.json(results)
    })
    .catch(error => console.error(error))
  })

  // Get Count ALL category
  router.route("/CountCategories").get((req, res)=>{
    categories.countDocuments()
    .then(results => {
      console.log(results)
      res.json({count: results})
    })
    .catch(error => console.error(error))
  })

  // Update category by Id
  router.put('/:id', async (req, res) => {
    categories.findOneAndUpdate(
      {'_id':ObjectId(req.params.id)},
      {
        $set: {
          name: req.body.name,
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

  // Delete category by id
  router.delete('/:id', (req, res) => {
    categories.deleteOne(
      {'_id':ObjectId(req.params.id)}
    )
      .then(result => {
        res.json(`Deleted`)
      })
      .catch(error => console.error(error))
  })


})

module.exports=router