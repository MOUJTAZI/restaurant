// use express in server.js by requiring it
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
require('dotenv').config()

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    next();
});
//Call Controllers
const userController= require('./controllers/userController')
const productsController= require('./controllers/productsController')
const categoriesController= require('./controllers/categoriesController')

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded


// create our api
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1> this is our api for food.')
})


// Controller for users
app.use('/users',userController);
app.use('/products',productsController);
app.use('/category',categoriesController);



//We need to create a server that browsers can connect to. 
app.listen(process.env.PORT, function() {
    console.log('listening on '+process.env.PORT)
  }) 