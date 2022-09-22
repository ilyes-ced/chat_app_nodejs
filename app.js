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
	cookie: {
		maxAge: 3600000*48 //2 days 
	}
}))




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





const pages_route = require('./routes/pages_router')

app.use('/',pages_route)
app.use('/login',pages_route)
app.use('/register',pages_route)
app.use('/logout',pages_route)
app.use('/change_chat_room',pages_route)






app.post('/sent_msg',async (req, res)=>{})










server.listen(3000);