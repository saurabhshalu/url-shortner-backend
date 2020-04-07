const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Link = require('./link.model');
const app = express();
const router = express.Router();

router.post('/save', (req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var random_string = (0|Math.random()*9e6).toString(36)
    var data = JSON.parse(req.body);
    const link = new Link({
        code: random_string, 
        url: data.url,
        date: new Date(),
        clicks: 0
    });
    link.save().then(() => {
        res.json({
            'code': random_string
        });
        console.log("new link shorten;)");    
    }).catch(err => {
        res.status(500).json({
            'error': 'duplicate entry'
        });
        console.log('duplicate random string:(', err);
    });
});


router.post('/get', (req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var data = JSON.parse(req.body);
    var qcode = data.code;

    Link.findOneAndUpdate({ code: qcode }, { $inc: { clicks: 1 } }, function(err,doc){
        if(err) {
            res.status(500);
        }
        else {
            if(doc!=null) {
                res.json({
                    'url': doc.url
                });
            }
            else {
                res.status(500);
            }
            
        }
    });
});


router.post('/history', (req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var data = JSON.parse(req.body);
    var qcode = data.code;


    Link.findOne({code: qcode}, function(err, doc){
        if(err) {
            res.status(500);
        }
        else {
            if(doc!=null) {
                res.json({
                    'history': doc
                });
            }
            else {
                res.status(500);
            }  
        }
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