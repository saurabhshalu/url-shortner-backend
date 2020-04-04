const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv').config();
const retry = require('retry');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;



const Link = require('./link.model');





const app = express();
const router = express.Router();


// function savetodatabase(data, n) {
//     var status = true;
//     while(status) {
//         const link = new Link({
//             code: n, 
//             url: data
//         });
//         link.save().then(() => {
//             res.json({
//                 'code': n
//             });
//             console.log("Successfully saved data in database");    
//             status = false;
//         }).catch(err => {
//             savetodatabase(data,n+1)
//             console.log('trying next value')
//         });
//     }   
// }

router.get('/',(req,res)=> {
    var random_string = 0;//(0|Math.random()*9e6).toString(36)
    const link = new Link({
        code: random_string, 
        url: 'content11'
    });
    link.save().then(() => {
        res.json({
            'code': random_string
        });
        console.log("Successfully saved data in database");    
    }).catch(err => {
        res.status(500).json({
            'error': 'duplicate entry'
        });
        console.log('duplicate entry found,......', err);
    });
   
});

router.get('/random',(req,res)=> {
    res.json({
        'random': (0|Math.random()*9e6).toString(36)
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

mongoose.connect(process.env.CONURL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});