const express = require('express')
const router = express.Router()
const auth_controller = require('../controllers/Auth_controller')
const is_auth_middleware = require("../middleware/is_auth_middleware")


router.get('/', is_auth_middleware, (req, res) => {
    console.log(req.session)
    res.render('home_page')
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


module.exports = router