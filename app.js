var mongoose=require("mongoose");
var express= require("express");
var fs=require("fs");
var app=express();
//........... Routers
var autheRoutes=require("./controllers/auth");
var homeRoutes=require("./controllers/home");
var OrderRoutes=require("./routes/orders")
var GroupRoutes=require("./routes/groups.js")

//................ Moddlewares
app.use("/auth",autheRoutes);
app.use("/home",homeRoutes);

app.use("/orders",OrderRoutes);
app.use("/groups",GroupRoutes);
app.use("/orders",OrderRoutes);

//................ Views
app.set('view engine','ejs');
app.set('views','./views');

mongoose.connect("mongodb://127.0.0.1:27017/notlob");
var files_arr=fs.readdirSync(__dirname+"/models")
files_arr.forEach(function(file){
  require(__dirname+"/models/"+file);
});


app.listen(8030);
