const express = require('express')
const app = express()
const session = require('express-session')
const mongo_session = require('connect-mongodb-session')(session)
const mongo_uri = 'mongodb://localhost:27017/chat'
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
	
	socket.on('stopped_typing',async (message)=>{
		socket.to(message).emit('user_is_typing', {chat_room:message, status:false})
	})

	socket.on('is_typing',async (message)=>{
		var user_data = await user_model.findOne(
			{_id : socket.request.session.user_id},
		)
		socket.to(message).emit('user_is_typing', {user:user_data.username, chat_room:message, status:true})
	})

	
	socket.on('joined_this_room',async (message)=>{
		socket.join(message)
	})
	socket.on('chat_msg',async (message)=>{
		var user_data = await user_model.findOne(
			{_id : socket.request.session.user_id},
		)
		var message_object = {user: user_data.id, message: message.message, CREATED_AT:Date.now()}
		await chat_model.findOneAndUpdate(
			{_id : message.chat_room},
			{$push: {chat_history: message_object}}
		)
		message_object = {username: user_data.username,pfp: user_data.pfp,color: user_data.color, message: message.message, CREATED_AT:Date.now(), chat_room: message.chat_room}
		io.in(message.chat_room).emit('message', message_object)
	})
})





const pages_route = require('./routes/pages_router')

app.use('/',pages_route)
app.use('/login',pages_route)
app.use('/register',pages_route)
app.use('/logout',pages_route)
app.use('/change_chat_room',pages_route)
app.post('/search_rooms', pages_route)
app.post('/create_chat_room',  pages_route)
app.post('/join_chat',  pages_route)


server.listen(3000);