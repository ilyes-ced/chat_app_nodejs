const express = require('express')
const router = express.Router()
const mongo_uri = 'mongodb://localhost:27017/test'
const auth_controller = require('../controllers/Auth_controller')
const is_auth_middleware = require("../middleware/is_auth_middleware")
const chat_model = require('../models/Chat')
const user_model = require('../models/User')



const mongoose = require('mongoose');
mongoose.connect(mongo_uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


router.get('/', is_auth_middleware, async (req, res) => {
    var ff = await user_model.findOne({email:req.session.email})
    res.render('home_page',{rooms:ff.chat_rooms})
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



router.post('/change_chat_room',(req,res)=>{
    console.log(req.body)
})


module.exports = router