const chat_model = require('../models/Chat')
const user_model = require('../models/User')


const search_chat = async (req, res)=>{
	try{	
		if(!req.body.query == ''){
			var pp = await chat_model.find({name: {'$regex': req.body.query}})
  			res.json(pp)
		}
	}catch{
		res.json('failure')
	}
}


const create_chat_room = async (req, res)=>{
	try{
		const exists = await chat_model.exists({name :req.body.query})
		if(exists){
			res.json('exists')
			return
		}
		var chat_room = new chat_model({
			name: req.body.query,
			members: [req.session.user_id],
		})
		await chat_room.save()
		await user_model.findOneAndUpdate(
			{_id : req.session.user_id},
			{$push: {chat_rooms: chat_room.id}}
		)
		res.json('succsess')
	}catch(err){
		console.log(err)
		res.json('failure')
	}
}


const join_chat = async (req, res)=>{
	try{
		await chat_model.findOneAndUpdate(
			{_id : req.body.query.split('_')[1]},
			{$push: {members: req.session.user_id}}
		)
		await user_model.findOneAndUpdate(
			{_id : req.session.user_id},
			{$push: {chat_rooms: req.body.query.split('_')[1]}}
		)
		res.end('succsess')
	}catch(err){
		console.log(err)
		res.json('failure')
	}
}




module.exports = {
    search_chat,create_chat_room,join_chat
}