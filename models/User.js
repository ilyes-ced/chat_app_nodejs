const mongoose = require('mongoose')
const schema = mongoose.Schema

const user_schema= new schema({
    username: {type:String,required:true},
    email: {type:String,required:true},
    pfp: {type:String,default:'default.jpg'},
    color: {type:String,default:'#39ff14'},
    password: {type:String,required:true},
    chat_rooms: [{type: String}],
},{timestamps: true}) 

const User = mongoose.model('User',user_schema)

module.exports = User
