// const mongoose = require('mongoose');

// const LinkSchema = mongoose.Schema({
//     code: String,
//     url: String,
// });

// module.exports = mongoose.model('Link', LinkSchema);


// // const NoteSchema = mongoose.Schema({
// //     title: String,
// //     content: String
// // }, {
// //     timestamps: true
// // });

// // module.exports = mongoose.model('Note', NoteSchema);


// const LinkSchema = {
//     code: 'code',
//     url: 'url',
//     date: 'date',
//     clicks: 'count'
// }

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const LinkSchema = new Schema({
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
})
LinkSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Link', LinkSchema)