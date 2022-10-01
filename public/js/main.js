var current_chat_room = 'room_1'



const socket = io()
socket.on('message',message=>{
    $('.all_chat_rooms').append("<div class='my-4 mx-2 p-4  rounded-lg  bg-tertiary '>"+message+"</div>")
})



$( "#close_add_chat_modal" ).on('click', function()  {
    $("#add_chat_modal" ).addClass('hidden')
})


$( "#chat_submit" ).on('click', function()  {
    socket.emit('chat_msg', $('#chat_input').val()+"/"+current_chat_room)
    $('.all_chat_rooms').append('<div class="w-full flex flex-row align-center"><div class="my-6 mx-2"><img class="rounded-full h-10 w-10" src="public/images/img1.png" alt=""></div><div><div class="my-4 mx-2 p-4 rounded-lg w-full bg-tertiary ">'+$('#chat_input').val()+'</div></div></div>')
    $('#chat_input').val('')
})



$('.change_chat_room').on('click', function()  {
    $('.all_chat_rooms').addClass('hidden')
    console.log($('#chat_room_'+$(this).attr('id')))
    $('#chat_room_'+$(this).attr('id')).removeClass('hidden')
    console.log($(this).attr('id'))
    current_chat_room = $(this).attr('id')
})




$('#add_chat_room').on('click', function()  {
    $('#add_chat_modal').removeClass('hidden')
})






$('#searched_room').on('input', function()  {

    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/search_rooms", true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({query: $('#searched_room').val() }))

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var jsonResponse = JSON.parse(xhr.responseText)
            console.log(jsonResponse[0])
            $('#searched_room').parent().append('<div class="m-4 p-2  border rounded-lg">'+jsonResponse[0].name+'</div>')
        }
    }

})



