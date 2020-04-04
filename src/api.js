const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv').config();

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

var count = 0;

router.get('/random',(req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var waitTill = new Date(new Date().getTime() + 2 * 1000);
    while(waitTill > new Date()){}
    console.log('request is being handeled....')
    if(++count>4) {
        res.json({
            'random': (0|Math.random()*9e6).toString(36)
        });
    }
    else {
        res.status(500).json({
            'error': 'something went wrong, duplicate found ;)'
        });
    }
});

// router.post('/test',(req,res)=> {
//     console.log('testing is here!')
//     res.json({
//         'test': JSON.parse(req.body)
//     });
// });



router.post('/test',(req,res)=> {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('testing is here!')
    console.log(JSON.parse(req.body))
    var data = JSON.parse(req.body);
    res.json({
        'test': data.myurl
    });
});










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