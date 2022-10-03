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
const user_model = require('./models/User')
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


const session_middleware = session({
	secret: 'my_key',
	resave: false,
	saveUninitialized: false,
	store: store,
	cookie: {
		maxAge: 3600000*48 //2 days 
	}
})

app.use(session_middleware)


const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(session_middleware))
io.use((socket, next) => {
	const ss = socket.request.session
	if (ss && ss.is_auth){
		next()
	}else{
		console.log('eroooooooooooooooor')
	}
})
//socket.emit('message', 'some string idk idk')
//socket.broadcast.emit()
//io.emit()
io.on('connection', socket=>{
	socket.emit('message', 'some string idk idk')
	socket.broadcast.emit('message', 'he has joined the chat')
	socket.on('disconnect', ()=>{
		io.emit('message', 'a user has left the chat')
	})
	var pp = async ()=>{
		var kk = await user_model.findOne({_id : socket.request.session.user_id})	
		kk.chat_rooms.forEach(element => {
			socket.join(element)
		});
	}
	pp()


	
	socket.on('chat_msg',async (message)=>{
		console.log('starting')
		console.log(message)
		var user_data = await user_model.findOne(
			{_id : socket.request.session.user_id},
		)
		var message_object = {user: user_data.id, message: message.message, CREATED_AT:Date.now()}
		console.log(message_object)
		await chat_model.findOneAndUpdate(
			{_id : message.chat_room},
			{$push: {chat_history: message_object}}
		)
		var message_object = {user: {username: user_data.username,pfp: "image"}, message: message.message, CREATED_AT:Date.now(), chat_room: message.chat_room}
		console.log(message_object)
		
		socket.to(message.chat_room).emit('message', message_object)
		//console.log(message)
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