const mongoose = require('mongoose')
const schema = mongoose.Schema

const chat_schema= new schema({
    name: {type:String,required:true},
},{timestamps: true}) 

const Chat = mongoose.model('Chat',chat_schema)

module.exports = Chat
