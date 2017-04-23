var mongoose=require("mongoose");
//____________________________________________________________ Return true if correct username and password __________//
function checkSignIn(Password,Email){
    var flag = false;
    var source ;
    mongoose.model("users").find({},{"_id":0,"name":1,"email":1,"password":1},function(err,users ) {
        source = users;
        for(var i = 0; i <users.length; i++) {
            if(Email==users[i].email && Password==users[i].password){
                flag=users[i];
                if(!flag){
                    console.log("ERROR: SIGNIN NOT Successfully!");
                    return false
                }
            }
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//___________________________________________return List of type and list of details of the user ______//
function getLeatestOrders(Email){
    var detaList=[]
    var typeList=[]
    var source ;
    mongoose.model("orders").find({"ownerEmail":Email},{"_id":false,"date":true,"type":true},{"$limit":10},function(err,orders){
        source=orders;
        for(var i = 0; i <orders.length; i++) {
           console.log(orders[i].date);
           console.log(orders[i].type);
           detaList.push(orders[i].date);
           typeList.push(orders[i].type);
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return [typeList,detaList];
}
//______________________________________________________________________return True if success Sign In__________//
function checkSignUp(Name,Email,Password){
    var userModel= mongoose.model("users")
    var new_user= new userModel();
    var source ;
    var flag = true;

    new_user.name=Name;
    new_user.email=Email;
    new_user.password=Password;
    new_user.save(function(err){
        source=err;
        if(err)
            flag=false
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
function displayImage(Imgsrc)
{
        var source ;
    mongoose.model("fs.files").find({"md5":Imgsrc},{"_id":0,"filename":1},function(err,data){
        source=data;
            console.log("ffffffffeeeedddd")
            console.log(data)

    });
return source;

}
//_____________________ getOrderList _____________________
function getMyOrdersList(email) {
    var OrderList = []
    var source
    var test
    console.log("orders list");
    mongoose.model("orders").find({$or:[{joined:{"$in":[email]}},{ownerEmail:email}]},function(err,OrderList){
        source=OrderList
        if(!err){
//             console.log("OrderList",OrderList)
//             console.log("sssssssssssssssssssssssss"+OrderList[0])
            if(!OrderList){
//                 console.log("data",OrderList);
                for(var i=0; i<OrderList.length; i++){
                    orderID=OrderList[i]._id;
                    OrderType=OrderList[i].type;
                    OrderRest=OrderList[i].from;
                    OrderInvited=OrderList[i].invited.length;
                    OrderJoined=OrderList[i].joined.length;
                    OrderStatus=OrderList[i].status;
                }
            }
        if(OrderList)
        {   console.log("_____________________")
            //  console.log(OrderList)
             test = OrderList
        }
}
})

while(source === undefined) {
    require('deasync').runLoopOnce();
}
 // console.log("Liiiiiiiiiiiiiiiiiiiiiiiist")
 // console.log(test)
return test
}//end fun

//____________________View Orders_________________
// _________________________view Order Details___________________________________\\
    function viewOrderDetails(orderId)
    {
       var source;
       var test;
      //  var orderDetails=[];
        mongoose.model("details").find({"orderId":orderId},{},function(err,details){
              source = details
            if(!err){
              if(!details)
                {
                   console.log("details",source);
                   for(var i=0; i<details.length; i++){
                       orderId=details[i].orderId;
                       person=details[i].person;
                       itemName=details[i].itemName;
                       price=details[i].price;
                       amount=details[i].amount;
                       comment=details[i].comment;
                       console.log("for i ",i, orderId, person, itemName, price,amount);
                     }
                }
                if(details)
                {
                  test = details
                }
                           }
       });
       while(source === undefined) {
           require('deasync').runLoopOnce();
       }
       console.log("__________________")
       console.log("OrderSoooource",test)
       return test
    }
//____________________________________________________ return List of Frinds Emails for the user _________________________________//
function getFriendsEmail(Email){
    var frindsEmail=""
    var source;
    console.log(Email)
    mongoose.model("users").find({"email":Email},{"_id":0,"friend":1},function(err,friend){
        source=friend;
        for(var i = 0; i <friend.length; i++) {
           frindsEmail=friend[i].friend;
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return frindsEmail;
}
//_____________________________________________________________return List of Frinds Names for the user _______//
function getFriendsName(resp,Email){
    var frindsEmail=getFriendsEmail(Email)
    console.log("eeeeeeeeeeeeee ",frindsEmail);

    var frindsName=[];

    for (var i = 0; i <= frindsEmail.length; i++) {
    (function (i) {
        mongoose.model("users").find({"email":frindsEmail[i]},{"_id":0,"name":1},function(err,friendName){
            if (err) throw err;
            if (!err && (i == frindsEmail.length)) {
                resp.render('friends',{FrindsName:frindsName,FrindsEmail:frindsEmail});
                return frindsName
            }else{
                if( frindsEmail.length != 0){
                    console.log("i",i);
                    frindsName.push(friendName[0].name)
                    console.log("friendName[0].name",friendName[0].name);
                    console.log("frindsName ",frindsName)
                }

            }

        });
    })(i)
}
}

function getFriendsName2(resp,Email){
    var frindsEmail=getFriendsEmail(Email)
    console.log("eeeeeeeeeeeeee ",frindsEmail);
    var source;
    var frindsName=[];

    for (var i = 0; i <= frindsEmail.length; i++) {
    (function (i) {
        mongoose.model("users").find({"email":frindsEmail[i]},{"_id":0,"name":1},function(err,friendName){
            source =err
            if (err) throw err;
            if (!err && (i == frindsEmail.length)) {
                //resp.render('friends',{FrindsName:frindsName,FrindsEmail:frindsEmail});
                console.log("END of FOR");
            }else{
                if( frindsEmail.length != 0){
                    console.log("i",i);
                    frindsName.push(friendName[0].name)
                    console.log("friendName[0].name",friendName[0].name);
                    console.log("frindsName ",frindsName)
                }

            }

        });
    })(i)
}
while(source === undefined) {
    require('deasync').runLoopOnce();
}
return frindsName;
}
//____________________________________________________________????????????????????????__//
function getEmail(name){
    var Email = "";
    var source ;
    mongoose.model("users").find({"name":name},{"_id":0,"email":1},function(err,users ) {
        source = users;
        for(var i = 0; i <users.length; i++) {
            if(Email==users[i].email && Password==users[i].password){
                flag=users[i];
                if(!flag){
                    console.log("ERROR: SIGNIN NOT Successfully!");
                    return false
                }
            }
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//______________________________________________________________________________ return false if Account is NOT Exist //
function checkIfFriendAccountExist(Email){
    var flag = false;
    var source ;
    mongoose.model("users").find({},{"_id":0,"email":1},function(err,users ) {
        source = users;
        for(var i = 0; i <users.length; i++) {
            if(Email==users[i].email){
                flag=users[i];
                if(!flag){
                    console.log("ERROR: Email Not Successfully!");
                    return false
                }
            }
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//______________________________________________________________________________
function checkIfFreindAlreadyExist(myEmail,friendEmail){
    var flag=true;
    var source ;
    mongoose.model("users").find({$and:[{friend:{"$in":[friendEmail]}},{email:myEmail}]},function(err,result ) {
        source = result;
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    if(source.length==0){    // Group NOT exist!
        flag=false;
    }
    return flag;
}
//______________________________________________________________________________ add Email to Friends List //
function addEmailtoFriendsList(myEmail,friendEmail) {
    var source;
    var flag=true ;
    mongoose.model("users").update({"email":myEmail},{$push:{"friend":friendEmail}},function(err){
        source=err;
        if(err)
            flag=false
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}

//______________________________________________________________________________ remove friend from freind List //
function removeFriend(myEmail,friendEmail) {
    var source;
    var flag=true ;
    mongoose.model("users").update({"email":myEmail},{$pull:{"friend":friendEmail}},function(err){
        source=err;
        if(err)
            flag=false
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//___________________________ Activity :D ___________________________________

//___________________________________ Function Activity Zefts :D _____________//
function getActivity(email){
    var friendsEmails=getFriendsEmail(email)
    console.log(friendsEmails)
    var allOrders=[]
    var source
    for(var i=0;i<=friendsEmails.length;i++) {(function (i) {
        mongoose.model("orders").find({"ownerEmail":friendsEmails[i]},{"_id":0,"type":1,"from":1},function(err,data){
            //source=err
            if (err) throw err;
            if (!err && (i == friendsEmails.length)) {
            console.log("Hello :D")
            source=allOrders;
            }else{
                console.log("i",i);
                allOrders.push(data)
                console.log(allOrders)
                // source=allOrders;
            }
        });
    })(i)
    // while(source === undefined) {
    //     require('deasync').runLoopOnce();
    // }

    // return allOrders;
} // End For

while(source === undefined) {
        require('deasync').runLoopOnce();
    }
console.log("________Soooorce______")
console.log(source)
console.log("_____Aalllll________")
    console.log("%%%%%%%%%,,,,,,,,,,,,,,,,,,,,,,%%%%%%%%%%%%%%%%%%%%%%%%%%%%",allOrders);
return allOrders
} //End FUNCTION

////////////////////////////////////////////// Order Details ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//_________________________________________________________________________________ return List of order Item __//
function ListOrderItems(myEmail) {

}
//_________________________________________________________________________________ radd new Item To Order __//
function addItemToOrder(orderID,personEmail,item,amount,price,comment){
    console.log("order :",orderID);
    var userModel= mongoose.model("details")
    var newItem= new userModel();
    var source ;
    var flag = false;

    newItem.orderId=orderID;
    newItem.person=personEmail;
    newItem.itemName=item;
    newItem.price=price;
    newItem.amount=amount;
    newItem.comment=comment;
    newItem.save(function(err){
        source=err;
        if(err)
            flag=false
        else {

            flag=true
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}

//____________________ Finish Order _______________
function finishOrder(orderId,email)
{
    var source ;
  flag=false;
console.log("order is finished");
mongoose.model("orders").update({$and:[{"ownerEmail":email},{"_id":orderId},{"status":{$ne:"finish"}}]}, {status:"finished"},function(err){
    source=err
    if(!err){
        console.log("order",orderId, "is finished");
        flag=true
    }
     else{
         console.log("error in finish order");
         console.log("orderId",orderId);
        }

    });
while(source === undefined) {
    require('deasync').runLoopOnce();
}
return flag;

}
//_____________________Cancel Order ______________
//cancel order
function cancelOrder(orderId,email)
{
    var source ;
    var flag = false;
    console.log("order is cancelled");
    mongoose.model("orders").remove({$and:[{"ownerEmail":email},{_id:orderId}]},function(err){
        source=err;
        if(!err){
            console.log("order",orderId, "is removed");
            flag=true;
        }
         else{
             console.log("error in cancel order");
             console.log("orderId",orderId);
         }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}

//_________________ Remove Invitaation :D _____________

    function removeInvite(orderId,email,removed)
    {
        console.log("order is removed");

mongoose.model("orders").update({$and:[{ownerEmail:email},{_id:orderId}]},
{$pull:{invited:removed}},function(err){
            if(!err)
                console.log("invitation",orderId, "is removed");
             else
                console.log("error in invitation is removed");
                console.log("orderId",orderId);
        });
    }

//// zaynab--------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
///////////////////////////////////////// newOrderDBFunctions /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//...newOrderDBFunction1......... check if AccountExist................. return false if Account is NOT Exist //
function isAccountExist(Email){
    var flag = false;
    var source ;
    mongoose.model("users").find({},{"_id":0,"email":1},function(err,users ) {
        source = users;
        for(var i = 0; i <users.length; i++) {
            if(Email==users[i].email){
                flag=true;
            }
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}

//...newOrderDBFunction2......... publish Order.................................
function addOrderWithInviteAndMenu( ownerEmail ,orderFrom, orderFor,orderStatus, invitedList,image){
    var source;
    // var groupMembers=0;
    var flag = true;
    var listOfInvited=[]
    var orderModel= mongoose.model("orders");
    console.log("get last order")
    console.log("invitedList",invitedList)
    mongoose.model("orders").find({},{"_id":1},{ "$sort": { _id : -1 } },function(err,data){
        if(!err){
            var date= new Date();
            var currentDate=date.getDate()+"-"+date.getMonth()+1+"-"+date.getFullYear()
            console.log("currentDate: ",currentDate);
            if(data.length>0){
                console.log("lastOrder",data[data.length-1]._id)
                orderIndex=data[data.length-1]._id+1;
                var new_order= new orderModel();
                new_order.orderId=orderIndex;
                new_order._id=orderIndex;
                console.log("orderIndex",orderIndex);
            }
            else{
                orderIndex=0
                var new_order= new orderModel();
                new_order.orderId=0;
                new_order._id=0;
                console.log("1st order");
            }
            new_order.ownerEmail=ownerEmail;
            new_order.type=orderFor;
            new_order.from=orderFrom;
            new_order.date=currentDate;
            new_order.status="waiting";
            console.log("invitedList: ",invitedList,"new_order.type",new_order.type,new_order.from, "new_order.from","new_order.ownerEmail",new_order.ownerEmail);
            if(invitedList.length>0){
                for(var i=0;i<invitedList.length;i++){
                    if(invitedList[i].includes("@")){
                        console.log("Emaiiiiiiiiiiiiiiiiil",i);
                        console.log("invitedList: ",invitedList);
                        listOfInvited.push(invitedList[i])
                        //new_order.invited=invitedList;
                    }
                    else {
                        console.log("Grouuuuuuuuuuuuuuuuuuuuuuuuuuuuuup");
                            console.log("in list of group members");
                            console.log("cheeeeeeeeeeeeeeck","i",i,new_order.ownerEmail,invitedList[i]);
                                var listOfMembers=getGroupObject(invitedList[i],new_order.ownerEmail);
                                console.log("listOfMembers",listOfMembers);
                                console.log("in list of group members",listOfMembers.members);
                                //new_order.invited=listOfMembers.members;
                                for(var j=0;j<listOfMembers.members.length;j++){
                                    listOfInvited.push(listOfMembers.members[j])
                                    console.log("listOfInvited",listOfInvited, "j ",j);
                                }
                                // groupMembers=new_order.invited;
                        }
                }
                console.log("listOfInvited",listOfInvited, "for");

                new_order.invited=listOfInvited.unique();
                if(image!=null)
                    new_order.menuImage="public/assets/images/1.jpg";
                else {
                    new_order.menuImage="no menu is available";
                }
            }
            else{
                new_order.invited=[];
                }
            new_order.save(function(err){
                source=err;
                if (!err)
                    console.log("not error add order", err)
                else{
                    flag = false
                    orderId=new_order._id;
                    console.log("error add order --> ", err);
                }
            });
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return [flag,orderIndex,listOfInvited.unique()];
}

//...newOrderDBFunction3......... send Notification.................................
function  addNotify(sender,reciever,type, orderId, from){
    console.log("addNotify",sender,reciever,type, orderId, from);
    var notifyModel= mongoose.model("notifications")
    var newNotification= new notifyModel();
    var source ;
    var flag = true;

    console.log("recieverEmail: ",reciever);
    newNotification.orderId=orderId;
    newNotification.from=from;
    newNotification.recieverEmail=reciever;
    newNotification.senderEmail=sender;
    newNotification.type=type;

    newNotification.save(function(err){
        source=err;
        if(err)
            flag=false
            else {
                console.log("notification is added")
            }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//...newOrderDBFunction4.........  get Notification List.................................
function returnId(orderId){
    console.log("orderId")
    if (orderId!='undefined')
        return orderId;
}

function getNotification(){
    var source ;
    mongoose.model("notifications").find({},{"orderId":1,"senderEmail":1,"recieverEmail":1,"type":1,"from":1},function(err,notification ) {
        source = notification;
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return source;
}

function joinOrder(orderId,email2Join){
    console.log("orderId :",orderId);
    console.log("orderId :",orderId);
    var source;
    var flag
    mongoose.model("orders").update({"orderId":orderId},{$push:{"joined":email2Join}},function(err){
        source=err;
        if(err)
            flag=false
        else{
            console.log("removeFromInvitedList!!");
            flag=removeFromInvitedList(orderId,email2Join);
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    console.log("joinOrder from DBFunctions");
    return flag
}
function removeFromInvitedList(orderId,email2Join){
    var source;
    var flag=true ;
    mongoose.model("orders").update({"orderId":orderId},{$pull:{"invited":email2Join}},function(err){
        source=err;
        if(err)
            flag=false
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    console.log("removeFromInvitedList from DBFunctions");
    return flag
}

function deleteFromNotification(orderID,myEmail) {
    var source;
    var flag=true;
    console.log("orderID: ",orderID)
    mongoose.model("notifications").remove({$and:[{"orderId":orderID},{"recieverEmail":myEmail}]},function(err){
        source=err;
        if(err){
            console.log("Error While deleting: ",err);
            flag=false
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}

///////////////////////////////////////// GroupsDBFunctions /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//...groupsDBFunction1......... check if Group already added................. return false if group NOT exists
function checkIfGroupExist(groupName,userEmail){
    var flag=true;
    var source ;
    mongoose.model("users").find({$and:[{groupName:{"$in":[groupName]}},{email:userEmail}]},function(err,result ) {
        source = result;
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    if(source.length==0){    // Group NOT exist!
        flag=false;
    }
    return flag;
}

//...groupsDBFunction1.........Add new group users collection................. return true if friend add Successfully..
function addGroupToUser(groupName, userEmail){
    var flag=true;
    var source ;
    mongoose.model("users").update({"email":userEmail},{$push:{"groupName":groupName}},function(err){
        source=err;
        if(err){
            flag=false;
            console.log(err);
      }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//...groupsDBFunction1......... add group to groups collection ................. return false if group NOT exists
function addGroupToGroups(groupName, userEmail){
    var source;
    var groupModel= mongoose.model("groups")
	var new_group= new groupModel();
    new_group.ownerEmail=userEmail;
	new_group.groupName=groupName;
	new_group.save(function(err){
        source=err;
        if (err){
            console.log("ERROR!!: CAN NOT add Group to Group collection!!!");
        }else {
            console.log("New Group Is Created Successfully in Groups collection");
            Flag = true;
        }
	});
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return source;
}
//...groupsDBFunction2..........................................return List of user's Groups .....//
function getMyGroups(myEmail) {
        var source;
        var flag=true ;
        mongoose.model("users").find({"email":myEmail},{"_id":0,"groupName":1},{},function(err,groupList){
            source=groupList;
            if(err)
                flag=false
        });
        while(source === undefined) {
            require('deasync').runLoopOnce();
        }
        if(source[0]==undefined){
            return ""
        }else {
            return source[0].groupName;
        }

}


//...Function2................................................. return List of Emails of Group members...//
function getGroupObject(groupName,userEmail) {
        var source;
        var flag=true ;
        console.log("sdddddddd",groupName,userEmail);
        //mongoose.model("groups").find({$and:[{"groupName":groupName},{"ownerEmail":email}]},{"_id":0,"members":1},{},function(err,group){
        mongoose.model("groups").find({$and:[{"groupName":groupName},{"ownerEmail":userEmail}]},{"_id":0,"members":1},function(err,group){
            source=group;
            if(err)
                flag=false
        });
        while(source === undefined) {
            require('deasync').runLoopOnce();
        }
        console.log("source",source);
        return source[0];
}
//...Function3.................................................. return List of Emails of Group members...//
function checkIfFriendInGroup(F2Group,NameGroup,email) {
    //---------------List Member Of the Group -----------
    var addGFlag = false;
    var source ;
    mongoose.model("groups").find({$and:[{"groupName":NameGroup},{"ownerEmail":email}]},{"_id":0,"members":1},function(err,groups) {
        source = groups;
        var len = source[0].members.length;
        var list =source[0].members;
        for(var i = 0; i <len; i++) {
            if(F2Group==list[i]){
                addGFlag=true;
                console.log(addGFlag)
                console.log("This User Is already Exist In This Group");
            }
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return addGFlag;
}
//...Function3........................................................ return true if friend add Successfully...//
function AddFriendToGroup(F2Group,NameGroup,email) {
    var source;
    var flag=true;
    mongoose.model("groups").update({$and:[{"groupName":NameGroup},{"ownerEmail":email}]},{$push:{"members":F2Group}},function(err){
        source=err;
        if(err){
            flag = false;
            console.log(err);
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}

//...Function5.........Remove group......................................//
function removeGroup(Email,gName){
    var source;
    var flag=true;
    console.log("Fffff"+Email+"ffffff"+gName)
    mongoose.model("users").update({"email":Email},{$pull:{"groupName":gName}},function(err){
        if(err){
            console.log(err);
        }else {
            mongoose.model("groups").remove({"ownerEmail":Email,"groupName":gName},function(err){
                source=err;
                if(err){
                    console.log(err);
                    flag=false;
                }
            })
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}
//...Function6.........Remove group......................................//

function removeMember(ownerEmail,memberEmail,group){
    var source;
    var flag=true;
    mongoose.model("groups").update({$and:[{"groupName":group},{"ownerEmail":ownerEmail}]},{$pull:{"members":memberEmail}},function(err){
        source=err;
        if(err){
            flag = false;
            console.log(err);
        }
    });
    while(source === undefined) {
        require('deasync').runLoopOnce();
    }
    return flag;
}



/////////////////////////////////////////////////////// return unique list /////////////////////////////
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}



module.exports = {
   checkSignIn,
   checkSignUp,
   getLeatestOrders,
   getFriendsEmail,
   getFriendsName,
   checkIfFriendAccountExist,
   addEmailtoFriendsList,
   removeFriend,
   getGroupObject,
   displayImage,
   addItemToOrder,
   AddFriendToGroup,
   getMyOrdersList,
   // addGroupToUsers,
   getActivity,
   viewOrderDetails,
   finishOrder,
   cancelOrder,
   removeInvite,
   getFriendsName2,
   checkIfFreindAlreadyExist,

   checkIfGroupExist,
   getMyGroups,
   checkIfFriendInGroup,
    addGroupToUser,
    addGroupToGroups,
    removeMember,
   removeGroup,
    addOrderWithInviteAndMenu,
    isAccountExist,
    addNotify,
    getNotification,
    joinOrder,
    deleteFromNotification

}
