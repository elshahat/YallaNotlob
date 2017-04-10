$(function(){
    var socket=io.connect("http://localhost:8030");
    ///***************** EVENTS
    socket.on("connect",function(){
        var logEmail =localStorage.LogInEmail;
        console.log("Emmllldsjadshakmmmmmail :",logEmail );
        socket.emit("join",logEmail);
    })

    socket.on("join",function(onlineUsers){
    console.log("online:" ,onlineUsers)
    })
    //--------------------------------------------------------------- add Friend
    $("#addFreindBtn").on('click',function(){
        $('#addFriendError').html("");
        var friendemail=$("#friendemail2Add").val()
        console.log("friendemail: ",friendemail);
        socket.emit("addFriend",friendemail);
        $("#friendemail2Add").val("");
    })

    socket.on("addFriend",function(result){
        if(!result){
            console.log(result);
            $('#addFriendError').html("this Email is NOT a member in YallaNotlob");
        }else{
            console.log(result);
            var content = $('#friendsList').html();
            content += "<article class='one_third'><div class='hgroup'><h6 class='heading'>"+result+"</h6></div></article>"
            $('#friendsList').html(content)
        }
    })
    //------------------------------------------------------------------------- remove friend
    $("article button").on('click',function(){
        var friendemail=$(this).attr('id');
        console.log("friendemail: ",friendemail);
        socket.emit("removeFriend",friendemail);
    })

    socket.on("removeFriend",function(result,FrindsName){
        if(result){
            console.log("result",result);
            $("#friendsList").html("")
            var content =""
            for (var i=0;i<FrindsName.length;i++){
                content +=""

            }


            $('#addFriendError').html("this Email is NOT a member in YallaNotlob");
        }else{
            console.log("ERROR while Remove Friend ");
            var content = $('#friendsList').html();
            content += "<article class='one_third'><div class='hgroup'><h6 class='heading'>"+result+"</h6></div></article>"
            $('#friendsList').html(content)
        }
    })


});
