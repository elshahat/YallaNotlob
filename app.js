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
        var result="Friend already Added";
        var isExist=DBFunctions.checkIfFriendAccountExist(friendEmail) //check if Friend Exist

        if (isExist){   //email is Exist
            console.log("isExist",isExist);
            result = DBFunctions.addEmailtoFriendsList(this.email,friendEmail);
            if(result)
                result=friendEmail  // Change !!!!
            console.log("result: ",result);
            client.emit("addFriend",result)
        }else{
            console.log(friendEmail," is NOT member  in YallaNotlob!!");
        }
        client.emit("friendAddedResp",result)
    });
    //........................................ remove friend
    client.on("removeFriend",function (friendEmail) {
        console.log("friend to remove", friendEmail);
        var isDeleted=DBFunctions.removeFriend(this.email,friendEmail) //check if Friend Exist
        if (isDeleted){   //email is Exist
            var friendsList = DBFunctions.getFriendsName(this.email)
            console.log("isDeleted",isDeleted);
            client.emit("removeFriend",isDeleted,friendsList)
        }else{
            console.log("Error while Remove Friend ");
        }
    });

    //........................................ remove from my group...................
    client.on("removeFromMyGroup",function (groupName,memberMail) 
    {
        console.log("friend to remove from my group ==> ",memberMail);
        var isRemoved=DBFunctions.removeFromMyGroup(groupName,memberMail) 
        if (isRemoved)
        {   
            var membersList = DBFunctions.retrieveMembersOfGroup(groupName)
            console.log("isRemoved",isRemoved);
            client.emit("removeGroupRes",isRemoved,membersList)
        }
        else
        {
            console.log("Error while Remove Friend from my group ");
        }
    });
    //..........................Add people to My order................................
    client.on("addPeopleToOrder",function (PeopleAddedToOrder) 
        {
        console.log("PeopleAddedToOrder",PeopleAddedToOrder);
        var result="PeopleAddedToOrder already Added";
        var isExist=DBFunctions.checkIfFriendAccountExist(PeopleAddedToOrder) 

        if (isExist)
        {  
            console.log("isExist",isExist);
            result = DBFunctions.addEmailtoFriendsList(this.email,PeopleAddedToOrder);
            if(result)
                result=PeopleAddedToOrder
            console.log("result: ",result);
            client.emit("addFriend",result)
        }
        else
        {
            console.log(PeopleAddedToOrder," is NOT member  in YallaNotlob!!");
        }
        client.emit("PeopleAddedToOrder",result)
    });
    //........................................ close  connection
    client.on("disconnect",function(){
        delete users[client.userName];
        console.log(client.userName,"is DISCONNECTED Now !!!");
     })

});



//........... Routers
var autheRoutes=require("./controllers/auth");  // index.html
var homeRoutes=require("./controllers/home");
var friendsRoutes=require("./controllers/friends");
var groupsRoutes=require("./controllers/groups");
var ordersRoutes=require("./controllers/orders");



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




//................ Views
app.set('view engine','ejs');
app.set('views','./views');

//................. Data Base
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/notlob");
var files_arr=fs.readdirSync(__dirname+"/models")
files_arr.forEach(function(file){
  require(__dirname+"/models/"+file);
});


//.................. static Files
app.use(express.static(__dirname + '/public'));


//app.listen(8030);
server.listen(8030)


// app.configure(function () {
//
// 	app.use(express.cookieParser());
// 	app.use(express.session({ secret: 'example' }));
// 	app.use(express.bodyParser());
// 	app.use(checkAuth);
// 	app.use(app.router);
// 	app.set('view engine', 'jade');
// 	app.set('view options', { layout: false });
//
// });
