const express = require('express')
const app = express()
const session = require('express-session')
const mongo_session = require('connect-mongodb-session')(session)
const mongo_uri = 'mongodb://localhost:27017/test'
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
const chat_model = require('./models/Chat')
const bodyParser = require('body-parser')


app.set('view engine', 'ejs');
app.use(express.static(__dirname))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())


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
	cookie: {
		maxAge: 3600000*48 //2 days 
	}
}))




//socket.emit('message', 'some string idk idk')
//socket.broadcast.emit()
//io.emit()
io.on('connection', socket=>{
	console.log(socket.request.session)
	socket.emit('message', 'some string idk idk')
	socket.broadcast.emit('message', 'he has joined the chat')
	socket.on('disconnect', ()=>{
		io.emit('message', 'a user has left the chat')
	})

	socket.on('chat_msg',async (message)=>{
		var kkk = message.split('/')
		await chat_model.findOneAndUpdate(
			{name : kkk[1]},
			{$push: {chat_history: {user: '6336f32528b3dc1c40454425', message: kkk[0], CREATED_AT:Date.now()}}}
		)
		
		console.log("///"+message)
	})
})





const pages_route = require('./routes/pages_router')

app.use('/',pages_route)
app.use('/login',pages_route)
app.use('/register',pages_route)
app.use('/logout',pages_route)
app.use('/change_chat_room',pages_route)



app.post('/search_rooms', async (req, res)=>{
	if(!req.body.query == ''){
		var pp = await chat_model.find({name: {'$regex': req.body.query}})
  		res.json(pp)
	}
})

app.post('/create_chat_room', async (req, res)=>{
	console.log(req.session)
	var chat_room = new chat_model({
		name: req.body.query,
		members: [req.session.user_id],
	})
	await chat_room.save()
	res.json('succsess')
})




server.listen(3000);