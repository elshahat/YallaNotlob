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
            }else{
                console.log("i",i);
                frindsName.push(friendName[0].name)
                console.log("friendName[0].name",friendName[0].name);
                console.log("frindsName ",frindsName)
            }

        });
    })(i)
}
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
////////////////////////////////////////////// Groups ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//_________________________________________________________________________________ return List of user Groups __//
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
        return source[0].groupName;
}
//_________________________________________________________________________________ return List of members Emails __//
function getGroupObject(groupName) {
        var source;
        var flag=true ;
        mongoose.model("groups").find({"groupName":groupName},{"_id":0,"members":1},{},function(err,group){
            source=group;
            if(err)
                flag=false
        });
        while(source === undefined) {
            require('deasync').runLoopOnce();
        }
        return source[0].members;
}

////////////////////////////////////////////// Order Details ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//_________________________________________________________________________________ return List of order Item __//
function ListOrderItems(myEmail) {
    
}
//_________________________________________________________________________________ radd new Item To Order __//
function addItemToOrder(orderID,personEmail,item,amount,price,comment){
    console.log("order :",orderID);
    var userModel= mongoose.model("orderDetails")
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
   getMyGroups,
   displayImage,
   addItemToOrder
}



// function tryy(){
//
//     var source ;
//     mongoose.model("users").find({},{"_id":0,"email":1,"password":1},function(err,users ) {
//         source = users;
//
//     });
//     while(source === undefined) {
//         require('deasync').runLoopOnce();
//     }
//     return ????;
// }
