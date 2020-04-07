const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Links = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
   },
   url: {
     type: String,
     required: true
   },
   date: {
     type: Date
   },
   clicks: {
     type: Number,
     default: 0
   }
});

Links.plugin(uniqueValidator);



const Link = mongoose.model('Link', Links);

module.exports = Link;