var mongoose=require("mongoose");
var express= require("express");
var session=require("express-session")
var DBFunctions = require("./controllers/DBfunctions.js")

var fs=require("fs");
var app=express();



//** http server
var http = require('http');
var server = http.createServer(app);
var socketIO = require('socket.io').listen(server);


//.................................................................................
//.................................................................................

var users = {}

socketIO.on("connection",function(client){
    //........................................ new connection
    client.on("join",function(clientEmail){
        client.email = clientEmail;
        console.log(client.email,"is CONNECTED Now !!!");
        users[clientEmail]= client;
        client.emit("join",Object.keys(users)); //// send connected users
        client.broadcast.emit("join",Object.keys(users));
        })
    //........................................ ADD Friend
    client.on("addFriend",function (friendEmail) {
        console.log("friend to add", friendEmail);
        var result=true;
        var list;
        var isExist=DBFunctions.checkIfFriendAccountExist(friendEmail) //check if Friend Exist
        if (isExist){   //case2:email is Exist
            console.log("isExist",isExist);
            if(DBFunctions.checkIfFreindAlreadyExist(this.email,friendEmail)){
                console.log(friendEmail,"is Already Added");
                result="this Email is Already Added "
            }else{
                result = DBFunctions.addEmailtoFriendsList(this.email,friendEmail);
                if(result){
                    list=DBFunctions.getFriendsEmail(this.email)
                    console.log(friendEmail,"true: friend added successfully: new list ",list);
                }
                else{
                    result = false
                }
            }
        }else{  //case1: this is NOT member
            console.log(friendEmail,"is NOT member  in YallaNotlob!!");
            result="this Email is NOT member  in YallaNotlob!!"
        }
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! result");
        client.emit("addFriend",result,list)
    });
    //........................................ remove friend
    client.on("removeFriend",function (friendEmail) {
        console.log("friend to remove", friendEmail);
        var isDeleted=DBFunctions.removeFriend(this.email,friendEmail) //check if Friend Exist
        if (isDeleted){   //email is Exist
            var friendsList = DBFunctions.getFriendsEmail(this.email)
            console.log("isDeleted",isDeleted,"friendsListtttttttttt",friendsList);
            client.emit("removeFriend",isDeleted,friendsList)
        }else{
            console.log("Error while Remove Friend ");
        }
    });

    ///////////////////////////////////////// Groups Functions /////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // groupsDBFunction1 - Add new Group ........................Asmaa................ checked!!
            //.................................................................................
            client.on("addNewGroup",function (groupName, ownerEmail) {
                console.log("GroupName --> ", groupName);
                var result ;
                var isGroupExist = DBFunctions.checkIfGroupExist(groupName, this.email)
                console.log("isGroupExist",isGroupExist);
                if(isGroupExist){
                    console.log("Group is already Added ");
                    result="Group is already Added"
                }else{
                    var isGroupAdd = DBFunctions.addGroupToUser(groupName, this.email)
                    if(isGroupAdd){
                        result="true"
                        DBFunctions.addGroupToGroups(groupName,this.email);
                    }else {
                        result="DataBase ERROR: Can NOT add Group!! "
                    }
                }
                client.emit("addGroupResponse",result,groupName)            //**Emit Message**//
             });

            // GroupFunctions - Function2 - Get Group members ........................... Zaynab .............
            //.................................................................................
            client.on("getGroupMembers",function (groupName) {
                console.log("Group Name: ", groupName);
                var groupObject = DBFunctions.getGroupObject(groupName,this.email);
                console.log("groupObjecti: ",groupObject);
                if(groupObject === undefined){
                    groupObject="Error While get data From DB"
                }
                client.emit("getGroupMembersResponse",groupObject.members)   //**Emit Message**//
                console.log(groupObject);
            });
            //........................................ Add Item to Order
  client.on("addItemToOrder",function (orderID,item,amount,price,comment) {
      console.log("item details: ",this.email,item,amount,price,comment);
      console.log("teeeeeeeeeeeeeeeest",orderID);
      var isItemAdded = DBFunctions.addItemToOrder(orderID,this.email,item,amount,price,comment);

      console.log("isItemAdded: ",isItemAdded);
      client.emit("addItemToOrderResponse",isItemAdded)
  });
  //_________________ View orderStatus
  client.on("ViewOrderId",function(orderId){
    console.log("---------------------------------------",orderId);
     var orderDetails = DBFunctions.viewOrderDetails(orderId)
     console.log("OrderssDetaails From socket",orderDetails);
     client.emit("ViewOrderId",orderDetails)
  })

  client.on("getupdatedOrderDetails",function(orderId){
    console.log("---------------------------------------",orderId);
     var orderDetails = DBFunctions.viewOrderDetails(orderId)
     console.log("OrderssDetaails From socket",orderDetails);
     client.emit("getupdatedOrderDetailsResponse",orderDetails)
     client.broadcast.emit("getupdatedOrderDetailsResponse",orderDetails)
  })



            // GroupFunctions - Function3 - Add a Friend to Group ...............................
            //.................................................................................
            client.on("AddFriend2Group",function (F2Group,NameGroup){
                var result;
                console.log("add ",F2Group," to ",NameGroup," owner ",this.email)
                var isAccountExist=DBFunctions.checkIfFriendAccountExist(F2Group)
                if(!isAccountExist){   // is account NOT exist ?
                    result="this is NOT valid Account"
                }else{
                    var isAlreadyMember = DBFunctions.checkIfFriendInGroup(F2Group,NameGroup,this.email)
                    if(isAlreadyMember){   // it is Already amember ?
                        result="This Account is Already Exist in this Group"
                    }else {
                        result=DBFunctions.AddFriendToGroup(F2Group,NameGroup,this.email)
                        console.log("member added Successfully!!")
                    }
                }
            console.log("result ",result);
            client.emit("AddFriend2GroupResponse",result,F2Group)
           });

        // GroupFunctions - Function4 - Remove Group ........................Meera................
        //.................................................................................
            client.on("RemoveGroup",function (GroupRemoved) {
                console.log("Group will Remove"+GroupRemoved)
                console.log(this.email)
                var result=DBFunctions.removeGroup(this.email,GroupRemoved) //check
                //send the new group list
                if(result){
                    var myGroupList=DBFunctions.getMyGroups(this.email);   //groupsDBFunction1
                    var groupMembersList= DBFunctions.getGroupObject(myGroupList[0],this.email)
                    client.emit("RemoveGroupResponse",myGroupList,groupMembersList.members)
                }else{
                    console.log("DB ERROR: can NOT Delete Group");
                }

            });
        // GroupFunctions - Function4 - Remove member from Group ........................
        //.................................................................................
        client.on("removeMember",function (memberEmail,group) {
            var result=DBFunctions.removeMember(this.email,memberEmail,group);
            console.log("result: ",result);
            if(result){
                var groupObject = DBFunctions.getGroupObject(group,this.email);
                console.log("groupObject: ",groupObject);
                if(groupObject === undefined){
                    groupObject="Error While get data From DB"
                }
                client.emit("getGroupMembersResponse",groupObject.members)
            }else{
                console.log("ERROR in DB");
            }
        })
// zaynab---------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
///////////////////////////////////////// Add new Order  Functions /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    client.on("isAccountExist",function (emailORgroup) {
        var result = false;
        var result1=DBFunctions.isAccountExist(emailORgroup)
        var result2=DBFunctions.checkIfGroupExist(emailORgroup,this.email)
        console.log("isExist: ",result1,result2);
        if(result1 || result2){
            result=true;
        }
        client.emit("isAccountExistReplay",result);
    })

    client.on("addNewOrder",function (orderFrom,orderFor,invitedList){
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",invitedList);
        var result = DBFunctions.addOrderWithInviteAndMenu( this.email ,orderFrom, orderFor,"waiting", invitedList, "image")
        console.log("flag",result[0]);
        console.log("order ID",result[1]);
        if(result[0]){
            orderId=result[1]
            invitedList=result[2];
            console.log("invited List", result[2]);
            //}
            for(var i=0;i<invitedList.length;i++){
                var isSaved=DBFunctions.addNotify(this.email,invitedList[i],"invitation",orderId,orderFrom);
                console.log("is saved notification: ",isSaved,"to ",invitedList[i]);
                //send Notification Update to online users
                sendNewNotificationList()
            }
        }else{
            console.log("ERROR: can NOT add this Order");
        }
    });

// orderFunctions - Function2- get notification .........................................................................
client.on("getNotification",function () {
    //reem
    var result= DBFunctions.getNotification();
    client.emit("NotificationUpdates",result);
})
client.on("getOrderUpdates",function () {
    //the new order list
    var newOrdersList=DBFunctions.getMyOrdersList(this.email)
    console.log("newOrdersList",newOrdersList);
    client.emit("getOrderUpdatesResponse",newOrdersList)
})
// orderFunctions - Function3- join order.........................................................................
client.on("joinOrder",function (orderId){
    console.log("join the order");
    var result=DBFunctions.joinOrder(orderId,this.email);
    console.log("join order resulttttttttt:".result);
    var isDeleted=DBFunctions.deleteFromNotification(orderId,this.email);
    console.log("deleteFromNotification result: ",isDeleted);
    sendNewNotificationList()
})

//_______________FinishOrder____________
client.on("FinishOrder",function(id){
  console.log("In FinishOrder  Function ")
  DBFunctions.finishOrder(id,this.email)
  DBFunctions.getMyOrdersList(this.email)
  sendNewOrderList(this.email)
  client.broadcast.emit("OrdersUpdated")
})
//______________CancelOrder_______________
client.on("CancelOrder",function(id){
  console.log("In CancelOrder  Function ")
  var result=DBFunctions.cancelOrder(id,this.email)
  console.log("cancel result: ",result);
  if(result){
      var deletFromNotifyResult = DBFunctions.deleteFromNotification(id,this.email);
      if(deletFromNotifyResult){
        sendNewOrderList(this.email)
        client.broadcast.emit("OrdersUpdated")
    }else{
        console.log("ERROR: can not delete from Notification");
    }
  }

})

// client.on("UPDATEordersAndNotify",function(){
//     // var OrdersnewList = DBFunctions.getMyOrdersList(this.email)
//     // var newNotificationList=DBFunctions.getNotification()
//     // client.emit("join",Object.keys(users)); //// send connected users
//     // client.broadcast.emit("join",Object.keys(users));
//     client.broadcast.emit("UPDATEordersAndNotifyReplay")
// })
// client.on("getUpdateRequist",function(){
//     var OrdersnewList = DBFunctions.getMyOrdersList(this.email)
//     var newNotificationList=DBFunctions.getNotification()
//     console.log("sa;ldkalkdas;ldk;ladska",OrdersnewList,newNotificationList);
//     client.emit("getUpdateRequistReplay",OrdersnewList,newNotificationList)
// })


client.on("getOrdersUpdateRequist",function(){
    console.log("ORDER UPDATES REQUESTED FROM: ",this.email);
    sendNewOrderList(this.email)
})


/////////////////////////////////////////////// Functions ////////////////////////////////////////
//**********************************************************************************************//
function sendNewNotificationList() {
    var result= DBFunctions.getNotification();
    console.log("UPDATE NOTIFICATION",result);
    console.log("UPDATE NOTIFICATION !!");
    client.emit("NotificationUpdates",result);
    client.broadcast.emit("NotificationUpdates",result);
}
function sendNewOrderList(email){
    var OrdersnewList = DBFunctions.getMyOrdersList(email)
    console.log("newList after cancelation ",OrdersnewList);
    console.log("UPDATE ORDER LIST");
    client.emit("updateOrdersTable",OrdersnewList);
}
});

//........... Routers
var autheRoutes=require("./controllers/auth");  // index.html
var homeRoutes=require("./controllers/home");
var friendsRoutes=require("./controllers/friends");
var groupsRoutes=require("./controllers/groups");
var ordersRoutes=require("./controllers/orders");
var orderDetailsRoutes=require("./controllers/orderDetails");
var forgotPassRoutes = require("./controllers/forgotPass");


//upload image
var multer = require("multer");   //define multer module
var upload = multer({dest: "./uploads"}); //destination to store images after upload

mongoose.connect("mongodb://127.0.0.1:27017/notlob");  //connect the database
var conn = mongoose.connection; //open connection
var gfs;

var Grid = require("gridfs-stream");  //mechanism for storing large files in MongoDB
Grid.mongo = mongoose.mongo;  //assign the driver(mongoose) directly to the gridfs-stream

conn.once("open", function(){ // we are connected
  gfs = Grid(conn.db);  //open db using grid module
  app.get("/", function(req,res){
    //res.render("/home");
  });
  //second parameter is multer middleware.
  app.post("/", upload.single("avatar"), function(req, res, next){
    // streaming to gridfs
    var writestream = gfs.createWriteStream({ filename: req.file.originalname});  //save the originalname of img into db
    // To stream data to GridFS we call createWriteStream
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(err){console.log("ghghghghghggh");;})
          .pipe(writestream);

    var FileName = DBFunctions.displayImage(req.file.originalname)
    console.log("8888888888888888 ",FileName);
    var rstream = fs.createReadStream(FileName);
    var bufs = [];
    rstream.on('data', function(chunk) {
        bufs.push(chunk);
    }).on('end', function() { // done
        var fbuf = Buffer.concat(bufs);
        var base64 = (fbuf.toString('base64'));
        res.send('<img src="data:image/jpeg;base64,' + base64 + '">');
    });
  });
});
//end upload

//................ Moddlewares
app.use(session({secret:"@#$%$^%$"}))
app.use(function (req,resp,next) {
    resp.locals={
        loggedIn:req.session.logged,
        userName:req.session.userName,
        userEmail:req.session.email
    }
    next();
});
app.use("/",autheRoutes)
app.use("/home",homeRoutes);

app.use("/friends",friendsRoutes);
app.use("/groups",groupsRoutes);
app.use("/orders",ordersRoutes);
app.use("/orderDetails",orderDetailsRoutes);
app.use("/forgotPass",forgotPassRoutes)



//................ Views
app.set('view engine','ejs');
app.set('views','./views');

//................. Data Base
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://127.0.0.1:27017/notlob");
var files_arr=fs.readdirSync(__dirname+"/models")
files_arr.forEach(function(file){
  require(__dirname+"/models/"+file);
});


//.................. static Files
app.use(express.static(__dirname + '/public'));


//app.listen(8030);
server.listen(8030)
