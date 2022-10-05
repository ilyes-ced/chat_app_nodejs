const express = require('express')
const router = express.Router()
const mongo_uri = 'mongodb://localhost:27017/test'
const auth_controller = require('../controllers/Auth_controller')
const chat_controller = require('../controllers/Chat_controller')
const is_auth_middleware = require("../middleware/is_auth_middleware")
const chat_model = require('../models/Chat')
const user_model = require('../models/User')



const mongoose = require('mongoose');
mongoose.connect(mongo_uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


router.get('/', is_auth_middleware, async (req, res) => {
    var user = await user_model.findOne({email:req.session.email})
    var rooms = await chat_model.find({_id:{$in: user.chat_rooms}})
    var users_array = []
    rooms.forEach(  (element) => {
        users_array = users_array.concat(element.members)
    })
    var users = await user_model.find({_id:{$in: users_array}}).select('username pfp')
    console.log(users)
    res.render('home_page',{rooms:rooms, users:users})
})

router.get('/login',(req, res) => {
    res.render('login')
})

router.get('/register',(req, res) => {
    res.render('register')
})


router.post('/login',auth_controller.login)

router.post('/register',auth_controller.register)

router.post('/logout',auth_controller.logout)



router.post('/search_rooms',chat_controller.search_chat)
router.post('/create_chat_room',chat_controller.create_chat_room)
router.post('/join_chat',chat_controller.join_chat)


module.exports = router