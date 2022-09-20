const express = require('express')
const router = express.Router()





router.get('/',(req, res) => {
    res.render('home_page')
})

router.get('/login',(req, res) => {
    console.log('gregerg')
    res.render('login')
})

router.get('/register',(req, res) => {
    console.log('gregerg')
    res.render('register')
})





module.exports = router