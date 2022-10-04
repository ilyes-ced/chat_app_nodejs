const chat_model = require('../models/Chat')
const user_model = require('../models/User')


const search_chat = async (req, res)=>{
	if(!req.body.query == ''){
		var pp = await chat_model.find({name: {'$regex': req.body.query}})
  		res.json(pp)
	}
}


const create_chat_room = async (req, res)=>{
	var chat_room = new chat_model({
		name: req.body.query,
		members: [req.session.user_id],
	})
	await chat_room.save()
	res.json('succsess')
}


const join_chat = async (req, res)=>{
	await chat_model.findOneAndUpdate(
		{_id : req.body.query.split('_')[1]},
		{$push: {members: req.session.user_id}}
	)
	await user_model.findOneAndUpdate(
		{_id : req.session.user_id},
		{$push: {chat_rooms: req.body.query.split('_')[1]}}
	)
	
	res.json('succsess')
}




module.exports = {
    search_chat,create_chat_room,join_chat
}