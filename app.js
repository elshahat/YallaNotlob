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
        client.emit("addFriend",result)
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
    //........................................ get Group Mambers
    client.on("getGroupMembers",function (groupName) {
        console.log("Group Name: ", groupName);
        var groupObject = DBFunctions.getGroupObject(groupName);
        console.log("groupObjecti: ",groupObject);

        if(groupObject === undefined){
            groupObject="Error While get data From DB"
        }
        client.emit("getGroupMembersResponse",groupObject)
        console.log(groupObject);
    });

    //........................................ Add Item to Order
    client.on("addItemToOrder",function (orderID,item,amount,price,comment) {
        console.log("item details: ",this.email,item,amount,price,comment);
        var isItemAdded = DBFunctions.addItemToOrder(orderID,this.email,item,amount,price,comment);
        console.log("isItemAdded: ",isItemAdded);
        var ordersList = 
        client.emit("addItemToOrderResponse",isItemAdded)
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
var orderDetailsRoutes=require("./controllers/orderDetails");

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
