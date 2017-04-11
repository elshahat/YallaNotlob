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

    //------------------------------------------------------------------------- on click Group name
    $("#GroupsNameList #groupName").on('click',function(){
        var groupName =$(this).text();
        console.log("groupName: ",groupName);
        socket.emit("getGroupMembers",groupName);
    })

    socket.on("getGroupMembersResponse",function(memberFriends){
        console.log("eeeeeeeeeeeeeeeeeeeeeee",memberFriends);
        console.log("ffffffffffffffffffffffff",memberFriends);

        if(memberFriends){
            $("#groupMembersList").html("")
            var content =""
            for (var i=0;i<memberFriends.length;i++){
                console.log("memberFriends[i]",memberFriends[i]);
                content+="<article class='one_third'><div class='hgroup'><h6 class='heading'>"+memberFriends[i]+"</h6></div><img src='../assets/images/1.jpg'></article>"
            }
            $("#groupMembersList").html(content)
        }else{
            console.log("ERROR !!! Canot get members from DB");
        }
    })


});
