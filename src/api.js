const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv').config();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.CONURL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const Link = require('./link.model');




const app = express();
const router = express.Router();


router.get('/',(req,res)=> {
    const link = new Link({
        code: 'title!!', 
        url: 'content11'
    });
    link.save().then(() => {
        console.log("Successfully saved data in database");    
    }).catch(err => {
        console.log('duplicate entry found,......', err);
    });
    res.json({
        'hello': process.env.CONURL
    });
});

// router.post('/test',(req,res)=> {
//     console.log('testing is here!')
//     res.json({
//         'test': JSON.parse(req.body)
//     });
// });

app.use('/.netlify/functions/api',router);

module.exports.handler = serverless(app);