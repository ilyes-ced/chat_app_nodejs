const mongoose = require('mongoose')
const schema = mongoose.Schema

const chat_schema= new schema({
    name: {type:String,required:true},
    pfp: {type:String, default:'default_room.jpg'},
    color: {type:String,default:'#39ff14'},
    members: [{type:String}],
    chat_history: [Object],
},{timestamps: true}) 

const Chat = mongoose.model('Chat',chat_schema)

module.exports = Chat
