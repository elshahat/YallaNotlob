var mongoose=require("mongoose");
var express= require("express");
var fs=require("fs");
var app=express();
//........... Routers
var autheRoutes=require("./controllers/auth");  // index.html
var homeRoutes=require("./controllers/home");
var friendsRoutes=require("./controllers/friends");
var groupsRoutes=require("./controllers/groups");
var ordersRoutes=require("./controllers/orders");

// var OrderRoutes=require("./routes/orders")
//
//
// var OrderRoutes=require("./routes/orders.js")





//................ Moddlewares
app.use("/",autheRoutes);
app.use("/home",homeRoutes);
app.use("/friends",friendsRoutes);
app.use("/groups",groupsRoutes);
app.use("/orders",ordersRoutes);



// app.use("/orders",OrderRoutes);
// app.use("/orders",OrderRoutes);


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


app.listen(8030);



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
