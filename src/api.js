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


//------------------------------------------------------------------------------------------------------------------------------------------------
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


// router.get('/get/{id}', (req,res)=> {
//     console.log('helloooooooooooooooooooooooooooooooooooooooooooo');
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     var qcode = req.params.id;
//     Link.findOneAndUpdate({ code: qcode }, { $inc: { clicks: 1 } }, function(err,doc){
//         if(err) {
//             res.status(500).json({
//                 'error': 'data not found'
//             });
//         }
//         else {
//             res.json({
//                 'url': doc.url
//             });
//         }
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