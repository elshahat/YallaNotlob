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
    socket.emit("getNotification");
    })
    //--------------------------------------------------------------- add Friend
    $("#addFreindBtn").on('click',function(){
        $('#addFriendError').html("");
        var friendemail=$("#friendemail2Add").val()
        console.log("friendemail: ",friendemail);
        $("#friendemail2Add").val("");
        socket.emit("addFriend",friendemail);
    })

    socket.on("addFriend",function(result,list){
        console.log(result);
        var content="";
        if(result==true){   // added successfully
            console.log("))))))))))))))))))))))) true");
            //var content = $('#friendsList').html();
            //content += "<article class='one_third'><div class='hgroup'><h6 class='heading'>"+result+"</h6></div></article>"
            for(var i=0;i<list.length;i++){
                content+='<article class="one_third" style="margin-top:-75px;">'+
                  '<div class="hgroup">'+
                    '<h6 class="heading" style="color: goldenrod;">'+list[i]+'</h6>'+
                    '<p style="display:none">'+list[i]+'</p></div>'+
                  '<img src="../assets/images/1.jpg" alt="">'+
                  '<footer><button id='+list[i]+' type="button" class="btn removeClass" >UnFriend &raquo;</button></footer>'+
                '</article>'
            }
            $('#friendsList').html(content)
        }else {
            console.log("))))))))))))))))))))))) false");
            $('#addFriendError').html(result);
        }
    })
    //_______________________ View Orders __________________________-
        function newDoc() {
            window.location.href="orderDetails"
        }
        $(document).on('click','.view',function(){
          console.log("fffffffffffffffffffffffffff")
          var orderId =$(this).attr('id');
          var orderStatus=$(this).parent().attr('id')
          console.log("-------------------------",orderStatus);
          console.log("-------------------------",orderId);
          console.log("iiiiiii",orderId)
          localStorage.setItem("orderId",orderId);
          localStorage.setItem("orderStatus",orderStatus);

          var orderId =localStorage.orderId;
          socket.emit("ViewOrderId",orderId)
        })

        socket.on("ViewOrderId",function(orderDetails) {
          var flag=false;
          console.log("@@@@@@@@@@@@@@@@")
          console.log(orderDetails)
          $("#orderDatailsTable").html(" ")
          var content="";
            console.log("da5aaaaaaaaaaaaaal");

            for(var i=0;i<orderDetails.length;i++){
              console.log("Leeeeeeeeeeenght",orderDetails.length);
              var person=orderDetails[i].person
              var itemName=orderDetails[i].itemName
              var price = orderDetails[i].price
              var amount=orderDetails[i].amount
              var comment=orderDetails[i].comment
              content+='<tr><td>'+person+'</td><td>'+itemName+'</td><td>'+amount+'</td><td>'+price+'</td><td>'+comment+'</td></tr>'
            }
            console.log("tttttttt",person,itemName,price,amount,comment)
            flag=true
            if(flag){
                newDoc();
                console.log("folsaaaaaaaaaaia",flag);
                console.log("orderDatailsTable",content)
                localStorage.setItem("orderDetailsList",content);
            }
        })
        //------------------------------------------------------------------------- on click ADD Item
          $("#addItemBtn").on('click',function(){
              var orderId =localStorage.orderId;
              var orderID=orderId
              var item=$("#itemName").val()
              var amount=$("#itemAmount").val()
              var price=$("#itemPrice").val()
              var comment=$("#itemComment").val()

              console.log("itemNamee: ",orderID,item,amount,price,comment);
              if((item!="")&&(amount!="")&&(price!="")){
                socket.emit("addItemToOrder",orderID,item,amount,price,comment);
              }

          })


          socket.on("getupdatedOrderDetailsResponse",function(orderDetails) {
            var flag=false;
            console.log("@@@@@@@@@@@@@@@@")
            console.log(orderDetails)
            $("#orderDatailsTable").html(" ")
            var content="";
              console.log("da5aaaaaaaaaaaaaal");

              $("#itemName").val("")
              $("#itemAmount").val("")
              $("#itemPrice").val("")
              $("#itemComment").val("")

              for(var i=0;i<orderDetails.length;i++){
                console.log("Leeeeeeeeeeenght",orderDetails.length);
                var person=orderDetails[i].person
                var itemName=orderDetails[i].itemName
                var price = orderDetails[i].price
                var amount=orderDetails[i].amount
                var comment=orderDetails[i].comment
                content+='<tr><td>'+person+'</td><td>'+itemName+'</td><td>'+amount+'</td><td>'+price+'</td><td>'+comment+'</td></tr>'
              }
              console.log("tttttttt",person,itemName,price,amount,comment)
              flag=true
              if(flag){
                  console.log("folsaaaaaaaaaaia",flag);
                  console.log("orderDatailsTable",content)
                  localStorage.setItem("orderDetailsList",content);
                  $("#orderDatailsTable").html(localStorage.orderDetailsList)
              }
          })
          socket.on("addItemToOrderResponse",function(isItemAdded){
              console.log(isItemAdded);
              socket.emit("getupdatedOrderDetails",localStorage.orderId)
          })



    //_________________ Finish _____________________
    $(document).on('click','#finish',function(){
      console.log("Finiiiiiish")
      var id = $(this).attr('class')
      console.log("FinishIDD",id)
      socket.emit("FinishOrder",id)
    })
    //____________________cancel______
      $(document).on('click','#cancel',function(){
      console.log("Cancellled :D")
      var id = $(this).attr('class')
      console.log("CancelIDD",id)
      socket.emit("CancelOrder",id)
    })

    //------------------------------------------------------------------------- remove friend
    $(document).on('click','.removeClass',function(){
    var friendemail=$(this).attr('id');
    $(this).parent().parent().hide();
    console.log("ddddddddddddddddd");
    console.log("friendemail: ",friendemail);
    socket.emit("removeFriend",friendemail);
})

socket.on("removeFriend",function(result,FrindsName){
    if(result){
        console.log("result",result);

        // $("#friendsList").html("")
        // var content =""
        // for (var i=0;i<FrindsName.length;i++){
        //     console.log("ERROR while Remove Friend ");
        //     var content = $('#friendsList').html();
        //     content += "<article class='one_third'><div class='hgroup'><h6 class='heading'>"+result+"</h6></div></article>"
        //     $('#friendsList').html(content)

        }
    //
    // }else{
    //     content +=""
    //     //$('#addFriendError').html("this Email is NOT a member in YallaNotlob");
    // }
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
                content+="<article class='one_third' style='margin-top: -140px;'><div class='hgroup'><h6 class='heading' style='color:goldenrod'>"+memberFriends[i]+"</h6></div><img src='../assets/images/1.jpg'></article>"
            }
            $("#groupMembersList").html(content)
        }else{
            console.log("ERROR !!! Canot get members from DB");
        }
    })

    /********************************************* Group Page *******************************************/
    //------------------------------ Add new Group ---------------------- zaynab --------//
    $("#addGroupBtn").on('click', function(){
        $('#addGroupError').html("");
        var groupName = $("#groupName").val()
        socket.emit("addNewGroup", groupName)
        $("#groupName").val("")
    })
    socket.on("addGroupResponse", function(result,groupName){
        if(result=="true"){
            console.log(result);
            var content = $('#GroupsNameList').html();
            content += '<li class="myGroupsItem"><a style="margin:10px" class="heading" id="groupName">'+groupName+'</a><div style="margin-left: 200px;margin-top: -28px;"><a id="addIcon"><img src="../assets/images/addFriendIcon.png" style="width: 35px;height: 30px;"></a><a class="removeG"><img src="../assets/images/remove.png" style="width: 35px;height: 30px;"></a></div></li>'
            $('#GroupsNameList').html(content)
        }else{
            console.log(result);
            $('#addGroupError').html(result);
        }
    })
    //------------------------------ Add Member To Group ---------------------- zaynab --------//
  $(document).on('click','#addMemberToGroup',function(){
    $('#addFriendToGroupError').html("");
    var F2Group;
    var test = $(this).parent().children()
    F2Group = test[0].value
    var test2 = $(this).parent().parent().parent().children()
    console.log(test2[0])
    var NameGroup = test2[0].textContent
    console.log("add "+F2Group+" to the Group "+NameGroup)
    $("#user").val("")
    socket.emit("AddFriend2Group",F2Group,NameGroup)
  })

  socket.on("AddFriend2GroupResponse",function(result,F2Group) {
    console.log("result ",result);
    if(result==true){
        var content = $('#groupMembersList').html();
        content +='<article class="one_third" style="margin-top: -140px;">'+
            '<div class="hgroup">'+
            '<h6 class="heading" style="color:goldenrod">'+F2Group+'</h6>'+
            '</div>'+
            '<img src="../assets/images/1.jpg" alt="">'+
            '<footer><a class="btn removeBtn" href="#" id='+F2Group+'>Remove &raquo;</a></footer>'+
            '</article>'
        $('#groupMembersList').html(content);
    }else if(result==false){
        console.log("result ", result);
       $('#addFriendToGroupError').html("Errr in dataBase, try Later");
    }
    else{
        console.log("result ", result);
       $('#addFriendToGroupError').html(result);
        }

  })
  //----------------- on click Group name -------------------------------------------------------- zaynab--//
  $(document).on('click','#GroupsNameList #groupName',function(){
      var groupName =$(this).text();
      $("#currentGroup").html(groupName);
      console.log("groupNamee: ",groupName);
      socket.emit("getGroupMembers",groupName);
  })

  $(document).on('click','#addIcon',function(){
      var groupName =$(this).parent().parent().children()[0].textContent
      $("#currentGroup").html(groupName);
      console.log("groupName: ",groupName);
      socket.emit("getGroupMembers",groupName);
  })

  socket.on("getGroupMembersResponse",function(memberFriends){
      console.log("memberFriends: ",memberFriends);
      if(memberFriends){
        $("#groupMembersList").html("")
        var content =""
        console.log("memberFriends.length",memberFriends.length);
        for (var i=0;i<memberFriends.length;i++){
            console.log("memberFriends[i]",memberFriends[i]);
            content+='<article class="one_third" style="margin-top: -140px;">'+
                '<div class="hgroup">'+
                '<h6 class="heading" style="color:goldenrod">'+memberFriends[i]+'</h6>'+
                '</div>'+
                '<img src="../assets/images/1.jpg" alt="">'+
                '<footer><a class="btn removeBtn" href="#" id='+memberFriends[i]+'>Remove &raquo;</a></footer>'+
                '</article>'
        }
        $("#groupMembersList").html(content)
    }else{
        console.log("ERROR !!! Canot get members from DB");
    }

  })
//------------------------------ remove Group ----------------------------- zaynab
    $(document).on('click','.removeG',function(){
        var parentTag = $( this ).parent().parent().children();
        console.log(parentTag[0].text)
        var GroupRemoved = parentTag[0].text ;
        socket.emit("RemoveGroup",GroupRemoved);
    })
    socket.on("RemoveGroupResponse",function(myGroupList,groupMembersList){
        $("#currentGroup").html(myGroupList[0]);

        $("#GroupsNameList").html("")
        var groupList=""
        for (var i=0;i<myGroupList.length;i++){
            console.log("myGroupList[i]",myGroupList[i]);
            groupList+='<li class="myGroupsItem">'+
            '<a style="margin:10px" class="heading" id="groupName">'+myGroupList[i]+'</a>'+
            '<div style="margin-left: 200px;margin-top: -28px;">'+
                '<a id="addIcon"><img src="../assets/images/addFriendIcon.png" style="width: 35px;height: 30px;"></a>'+
                '<a class="removeG" id="removeIcon"><img src="../assets/images/remove.png" style="width: 35px;height: 30px;"></a>'+
                '</div></li>'
        }
        $("#GroupsNameList").html(groupList)

        console.log("dddddddddddd",groupMembersList);

        var content =""
        for (var i=0;i<groupMembersList.length;i++){
            console.log("memberFriends[i]",groupMembersList[i]);
            content+='<article class="one_third" style="margin-top: -140px;">'+
                '<div class="hgroup">'+
                '<h6 class="heading"> style="color:goldenrod"'+groupMembersList[i]+'</h6>'+
                '</div>'+
                '<img src="../assets/images/1.jpg" alt="">'+
                '<footer><a class="btn removeBtn" href="#" id='+groupMembersList[i]+'>Remove &raquo;</a></footer>'+
                '</article>'
        }
        $("#groupMembersList").html(content)
    })
    //------------------------------------------ Remove member From Group------------//
    $(document).on('click','.removeBtn',function(){
        var memberEmail=$(this).attr('id');
        var groupname=$("#currentGroup").html()
        socket.emit("removeMember",memberEmail,groupname);
    })
//----- zaynab --------------------------------------------------------------------------------------------//
/********************************************* Add new Order Page *******************************************/
 var invitedList=[];
/********************************************* Add new memeber to invited List*******************************************/
$(document).on('click','#addMemberBtn',function(){
    $('#invitedMembersError').html("");
    var invitedEmail=$('#invitedEmail').val()
    socket.emit("isAccountExist",invitedEmail);
    console.log("kkkkkkkkkkkkkkk",invitedEmail);
})
socket.on("isAccountExistReplay",function(result){
    console.log("result: ",result);
    if(!result){
        $('#invitedMembersError').html("Invalid Account!!");
    }else{
        console.log("is in array: ",$.inArray("zaynab@yahoo.com",invitedList));
        var invited=$('#invitedMembers').html();
        var memberEmail=$('#invitedEmail').val()
        if(($.inArray(memberEmail,invitedList))==(-1)){
            invitedList.push(memberEmail)
            $('#invitedEmail').val("")
            invited+='<li class="one_quarter" style="width: 613px;margin-top:20px;">'+
              '<article id="invitedmember">'+
                '<div style="margin-right: 498px;">'+
                 ' <h6 class="heading" style="margin-right: -30px;margin-bottom: 8px;">'+memberEmail+'</h6>'+
                  '<figure class="avatar"><img src="assets/images/avatar.png" alt=""></figure>'+
                  '<h6 class="heading font-x1" style="margin-top: 13px;"><a id="'+memberEmail+'"href="#">Remove</a></h6>'+
                '</div>'+
              '</article>'+
            '</li>'
            $('#invitedMembers').html(invited);
        }else{
            $('#invitedMembersError').html("memeber is Alraedy Added!!");
        }
        console.log("invitedList: ",invitedList);
    }
})
/********************************************* remove memeber from invited List **************************/
$(document).on('click','#invitedmember h6 a',function(){
    var member2Remove=$(this).attr('id');
    console.log("member to remove",member2Remove);
    var index=invitedList.indexOf(member2Remove);
    invitedList.splice(index,1)
    console.log("invitedList: ",invitedList);

    var content="";
    for(var i=0;i<invitedList.length;i++){
        content+='<li class="one_quarter" style="width: 613px;margin-top:20px;">'+
          '<article id="invitedmember">'+
            '<div style="margin-right: 498px;">'+
             ' <h6 class="heading" style="margin-right: -30px;margin-bottom: 8px;">'+invitedList[i]+'</h6>'+
              '<figure class="avatar"><img src="assets/images/avatar.png" alt=""></figure>'+
              '<h6 class="heading font-x1" style="margin-top: 13px;"><a id="'+invitedList[i]+'"href="#">Remove</a></h6>'+
            '</div>'+
          '</article>'+
        '</li>'
    }
    $('#invitedMembers').html(content);
})
/********************************************* publish invitation **************************/
$(document).on('click','#publishOrderBtn',function(){
    console.log("******************Publish Order********************");
    var fromInput = $("#addOrderFromInput").val()
    var forInput=$("#orderFor option:selected").text();
    console.log("new Order: ", fromInput,forInput,invitedList);
    var modal = document.getElementById('orderModal');
    modal.style.display = "none";
    // img???????/
    socket.emit("addNewOrder",fromInput,forInput,invitedList)
    console.log("@@@@@@@@@@@@@!!!!!!!!!@#$%^&^%$#@!@#$%^&*&^%$#@");
    socket.emit("getOrdersUpdateRequist")
})
/********************************************* get invitation updates **************************/

socket.on("NotificationUpdates",function(notificationObject){
console.log("notificationObject: ",notificationObject);
if(notificationObject!=null){
$("#notificationList").html("")
var content=""
console.log("notification update");
for(var i=0;i<notificationObject.length;i++){
    if(notificationObject[i]['recieverEmail']==localStorage.LogInEmail){
        console.log(notificationObject[i]['senderEmail']," invite you to his order ", notificationObject[i]['orderId']);
        content+=notificationObject[i]['senderEmail']+" invited you to his order from"+ notificationObject[i]['from']+'<br/><button class="btn" id='+notificationObject[i]['orderId']+'>Join</button><br/>'
    }
}
    $("#notificationList").html(content) //update Notification
    console.log("newOrdersList hhhhhhhhhhhhhhhhhher");

    socket.emit("getOrdersUpdateRequist")
}
})
/********************************************* onClick join button**************************/
$(document).on('click','#notificationList button',function(){
    console.log("send join request!!");
    var OrderId = $(this).attr('id');
    console.log("id",OrderId);
    socket.emit("joinOrder",OrderId);
})



//######################################################### GET Updates ############################################
socket.on("updateOrdersTable",function(newListObject){
    console.log("newListObject after Cancel Order",newListObject);
    var content=""
    //$("#orderTable").html(newListObject[0])
    for (var i = 0; i < newListObject.length; i++) {
        content+='<tr><td style="display: -moz-popup;" id="orderID">'+newListObject[i]._id+'</td>'+
                    '<td>'+newListObject[i].type+'</td>'+
                    '<td>'+newListObject[i].from+'</td>'+
                    '<td>'+newListObject[i].invited+'</td>'+
                    '<td>'+newListObject[i].joined+'</td>'+
                    '<td>'+newListObject[i].status+'</td>'
        if(newListObject[i].ownerEmail==localStorage.LogInEmail){
            console.log("owner Email");
            if(newListObject[i].status=="finished"){
                console.log("finished Email");
                content+='<td id='+newListObject[i].status+'><a id='+newListObject[i]._id+' class="view" >View</a><a href="#" class='+newListObject[i]._id+' id="cancel">Cancel</a></td></tr>'
            }else{
                console.log("NOTfinished Email");
                content+='<td id='+newListObject[i].status+'><a id='+newListObject[i]._id+' class="view" >View</a><a href="#" class='+newListObject[i]._id+' id="finish" style="padding:5px">Finish</a><a href="#" class='+newListObject[i]._id+' id="cancel">Cancel</a></td></tr>'
            }
        }else{
            content+='<td  id='+newListObject[i].status+'><a id='+newListObject[i]._id+' class="view" >View</a></td></tr>'
        }
    }
    //console.log("new content",content);
    $("#orderTable").html(content)
})
//
socket.on("OrdersUpdated",function () {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! updatesUPDATEorders");
    socket.emit("getOrdersUpdateRequist")
})
//
// socket.on("getUpdateRequistReplay",function (OrderList,notificationObject) {
//     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! updates");
//     console.log(OrderList,notificationObject) ;
//
//     ///////////////
//     $("#notificationList").html("")
//     var content=""
//     console.log("notification update");
//     for(var i=0;i<notificationObject.length;i++){
//         if(notificationObject[i]['recieverEmail']==localStorage.LogInEmail){
//             console.log(notificationObject[i]['senderEmail']," invite you to his order ", notificationObject[i]['orderId']);
//             content+=notificationObject[i]['senderEmail']+" invited you to his order from"+ notificationObject[i]['from']+'<br/><button class="btn" id='+notificationObject[i]['orderId']+'>Join</button><br/>'
//         }
//     }
//     $("#notificationList").html(content)
//     ////////////////////////
//
// })
//

});
