const mongoose = require('mongoose')
const schema = mongoose.Schema

const message_schema= new schema({
    name: {type:String,required:true},
    members: [{id:{type:String}, usernameid:{type:String}}],
    message_history: [Object],
},{timestamps: true}) 

const Message = mongoose.model('Message',message_schema)

module.exports = Message
