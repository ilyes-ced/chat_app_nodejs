const socket = io()
if($('.all_chat_rooms').length){
    var current_chat_room = $('.all_chat_rooms').first().attr('id').split('_')[2]
    $(".all_chat_rooms").scrollTop($(".all_chat_rooms")[0].scrollHeight);
}

$('#chat_input').on('input', function()  {
    socket.emit('is_typing', current_chat_room)
})

socket.on('message',(message)=>{
    console.log(message)
    if(!$('#chat_room_'+message.chat_room).hasClass('hidden')){
        $('#chat_room_'+message.chat_room).append('<div class="w-full  flex flex-row align-center " ><div class="my-6 mx-2"><img class="rounded-full h-10 w-10" src="public/images/'+message.pfp+'" alt=""></div><div><div class="my-4 mx-2 p-4 rounded-lg w-full bg-tertiary"><div class="text-sm text-gray-400">'+message.username+'</div><div>'+message.message+'</div></div></div></div>')
        console.log('if')
        $("#chat_room_"+message.chat_room).scrollTop($(".all_chat_rooms")[0].scrollHeight);
    }else{
        console.log('else')
        $('#'+message.chat_room).css({'background-color': 'green'})
        $('#chat_room_'+message.chat_room).append("<div class='w-full  flex flex-row align-center ' ><div class='my-6 mx-2'><img class='rounded-full h-10 w-10' src=public/images/"+message.pfp+"'  alt=''></div><div><div class='my-4 mx-2 p-4 rounded-lg w-full bg-tertiary '>"+message.message+"</div></div></div>")
        $("#chat_room_"+message.chat_room).scrollTop($(".all_chat_rooms")[0].scrollHeight);
    }
})


socket.on('user_is_typing',(message)=>{
    if(!($('#is_typing_div').length)){
        setTimeout(function(){
            $('#chat_room_'+message.chat_room).append('<div id="is_typing_div" class="w-full bg-blue-600 text-center">'+message.user+' is typing</div>')
            $(".all_chat_rooms").scrollTop($(".all_chat_rooms")[0].scrollHeight);
        }, 3000)
    }
})

$( "#close_add_chat_modal" ).on('click', function()  {
    $("#add_chat_modal" ).addClass('hidden')
})

$( "#close_create_chat_modal" ).on('click', function()  {
    $("#create_chat_modal" ).addClass('hidden')
})


$( "#chat_submit" ).on('click', function()  {
    socket.emit('chat_msg', {message: $('#chat_input').val(),chat_room: current_chat_room})
    $('#chat_input').val('')
    $(".all_chat_rooms").scrollTop($(".all_chat_rooms")[0].scrollHeight);

})



$('.change_chat_room').on('click', function()  {
    $('.all_chat_rooms').addClass('hidden')
    $('#chat_room_'+$(this).attr('id')).removeClass('hidden')
    current_chat_room = $(this).attr('id')

})




$('#add_chat_room').on('click', function()  {
    $('#add_chat_modal').removeClass('hidden')
})

$('#create_new_chat_room').on('click', function()  {
    $('#add_chat_modal').addClass('hidden')
    $('#create_chat_modal').removeClass('hidden')
})
$('#searched_room_modal').on('click', function()  {
    $('#create_chat_modal').addClass('hidden')
    $('#add_chat_modal').removeClass('hidden')
})





$('#searched_room').on('input', function()  {
    if($('#searched_room').val()==''){
        $('#recommendations').html('')
    }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/search_rooms", true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({query: $('#searched_room').val() }))

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var jsonResponse = JSON.parse(xhr.responseText)
            console.log(jsonResponse.length)
            if(jsonResponse.length==0){
                $('#recommendations').html('')
            }
            jsonResponse.forEach(element => {
                if(!($('#recommendations').find('#search_'+element._id).length)){
                    console.log(element)
                    $('#recommendations').append('<div id="search_'+element._id+'" class="added_searched_element cursor-pointer  m-4 p-2 hover:bg-blue-800 border rounded-lg">'+element.name+'</div>')
                }
            });
            /*
            for(let i=0; i<jsonResponse.lenght ;i++){
                $('#recommendations').appendTo('<div class="m-4 p-2  border rounded-lg">'+jsonResponse[0].name+'</div>')
            }*/
        }
    }

})


$('#create_new_chat_room_submit').on('click', function()  {
    
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/create_chat_room", true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({query: $('#new_created_room').val() }))

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var jsonResponse = JSON.parse(xhr.responseText)
            if(jsonResponse == 'succsess'){
                $('#create_chat_modal').addClass('hidden')       
                $('body').prepend('<div id="to_be_hidden" class="h-full w-full absolute bg-[rgb(0,0,0,0.5)] flex items-center justify-center "  ><div tabindex="-1" aria-hidden="true" class=" overflow-y-auto overflow-x-hidden absolute  z-50 h-modal justify-center items-center">created succsuflyy</div></div>')
                setTimeout(function(){
                    $('#to_be_hidden').remove()
                }, 2000)
            }else if(jsonResponse == "failure"){
                alert('failed')
            }
        }
    }

})






$('body').on('click','.added_searched_element', function()  {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/join_chat", true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({query: $(this).attr('id') }))

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var jsonResponse = JSON.parse(xhr.responseText)
            console.log(jsonResponse[0])
            if(jsonResponse == 'succsess'){
                alert(jsonResponse)
            }else if(jsonResponse == "failure"){
                alert('failed')
            }
        }
    }

})






$(document).keyup(function(event){
    if($('#chat_input').is(':focus') && event.key == "Enter"){
        $('#chat_submit').trigger('click')    
    }
})



$(document).keyup(function(event){
    if($('#new_created_room').is(':focus') && event.key == "Enter"){
        $('#create_new_chat_room_submit').trigger('click')    
    }
})
