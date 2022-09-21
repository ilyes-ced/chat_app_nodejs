const express = require('express')
const app = express()
const session = require('express-session')
const mongo_session = require('connect-mongodb-session')(session)
const mongo_uri = 'mongodb://localhost:27017/test'
const user_model = require('./models/User')
const bcrypt = require('bcrypt')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)


//socket.emit('message', 'some string idk idk')
//socket.broadcast.emit()
//io.emit()
io.on('connection', socket=>{
	console.log('it is working')
	socket.emit('message', 'some string idk idk')
	socket.broadcast.emit('message', 'he has joined the chat')
	socket.on('disconnect', ()=>{
		io.emit('message', 'a user has left the chat')
	})

	socket.on('chat_msg',(message)=>{
		console.log(message)
	})
})



app.set('view engine', 'ejs');
app.use(express.static(__dirname))
app.use(express.urlencoded({extended: true}))







const mongoose = require('mongoose');
mongoose.connect(mongo_uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});






const store = new mongo_session({
	uri: mongo_uri,
	collection: 'sessions_store',
}) 
app.use(session({
	secret: 'my_key',
	resave: false,
	saveUninitialized: false,
	store: store,
}))


const is_auth = (req,res,next) => {
	if(req.session.is_auth){
		next()
	}else{
		res.redirect('/login')
	}
}












const pages_route = require('./routes/pages_router')
app.get('/', is_auth,(req, res)=>{
	res.render('home_page')
})

app.get('/login',(req,res)=>{
	res.render('login')
})
app.get('/register',(req,res)=>{
	res.render('register')
})





app.post('/login',async (req, res)=>{
	const user = await user_model.findOne({email:req.body.email})
	if(!user) return redirect("/login")
	console.log(req.body.password)
	console.log(user.password)
	const matched = await bcrypt.compare(req.body.password, user.password)
	console.log(matched)
	if(!matched) return res.redirect('/login')
	req.session.is_auth = true
	req.session.username = user.username
	req.session.email = req.body.email
	res.redirect('/')
})

app.post('/register',async (req, res)=>{
	let user = await user_model.findOne({email:req.body.email})
	if(user) return redirect("/register")
	const hash_password = await bcrypt.hash(req.body.password, 10)
	user = new user_model({
		username: req.body.username,
		email: req.body.email,
		password: hash_password,
	})
	await user.save()
	res.redirect('/login')
})

app.post('/logout',async (req, res)=>{
	req.session.destroy((err)=>{
		if(err) throw err
		res.redirect('/')
	})
})



app.post('/sent_msg',async (req, res)=>{})










server.listen(3000);