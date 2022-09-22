const mongoose = require('mongoose')
const schema = mongoose.Schema

const chat_schema= new schema({
    name: {type:String,required:true},
    members: [{id:{type:String}, usernameid:{type:String}}],
    chat_history: [Object],
},{timestamps: true}) 

const Chat = mongoose.model('Chat',chat_schema)

module.exports = Chat
