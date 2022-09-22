$(function() {

const socket = io()
socket.on('message',message=>{
    $('#chat_box').append("<div class='my-4 mx-2 p-4  rounded-lg  bg-tertiary '>"+message+"</div>")
})







$( "#chat_submit" ).on('click', function()  {
    socket.emit('chat_msg', $('#chat_input').val())
    $('#chat_box').append('<div class="w-full flex flex-row align-center"><div class="my-6 mx-2"><img class="rounded-full h-10 w-10" src="public/images/img1.png" alt=""></div><div><div class="my-4 mx-2 p-4 rounded-lg w-full bg-tertiary ">'+$('#chat_input').val()+'</div></div></div>')
    $('#chat_input').val('')
})



$('.change_chat_room').on('click', function()  {
    console.log($(this).attr('id'))
})


/*
$.ajax({
    url : '/change_chat_room',
    type : 'POST',
    data : {
        'chat_room_id' : $(this).attr('id')
    },success : function(data) {              
        alert('Data: '+data);
    }
})
*/

})