const socket = io()
socket.on('message',message=>{
    $('#chat_box').append("<div class='rounded-lg bg-blue-600 m-8 p-5'>"+message+"</div>")
})







$( "#chat_submit" ).on('click', () => {
    socket.emit('chat_msg', $('#chat_input').val())
    $('#chat_box').append("<div class='rounded-lg bg-red-600 m-8 p-5'>"+$('#chat_input').val()+"</div>")
})
