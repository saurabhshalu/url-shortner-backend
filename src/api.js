const express = require('express');
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Link = require("./data");
const app = express();
const router = express.Router();
const dotenv = require('dotenv').config();

mongoose
  .connect(process.env.CONURL)
  .then(() => console.log("Connected to mongodb"))
  .catch(err => console.log(err));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


router.post("/save", function(req, res) {
    var random_string = (0|Math.random()*9e6).toString(36)
    var data = JSON.parse(req.body);
    const link = new Link({
        code: random_string, 
        url: data.url,
        date: new Date(),
        clicks: 0
    });
    link.save().then(() => {
        res.status(200).json({
            'code': random_string
        });  
    }).catch(err => {
        res.status(500).send('duplicate entry not allowed.');
    });
});

router.post("/getdata", function(req, res) {
    var data = JSON.parse(req.body);
    var qcode = data.code;
    var type = data.type;

    if(type=='history') {
        Link.findOne({"code":qcode},function(err,doc) {
            if(err) {
                res.status(500).send('internal error');
            }
            else {
                if(doc!=null) {
                    res.status(200).json({
                        'history': doc
                    });
                }
                else {
                    res.status(404).send('not found');
                }  
            }
        });
    }
    else {
        Link.findOneAndUpdate({"code":qcode}, { $inc: {clicks: 1} }, function(err,doc){
            if(err){
                res.status(500).send('Something went wrong...');
            }
            else {
                if(doc!=null) {
                    res.status(200).json({
                        'url': doc.url
                    });
                }
                else {
                    res.status(404).send('not found');
                }
            }
        });
    } 
});

app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);   