var express= require("express");
var app=express();
//........... Routers
var autheRoutes=require("./controllers/auth");
var homeRoutes=require("./controllers/home");

<<<<<<< HEAD
var OrderRoutes=require("./routes/orders.js")

=======
>>>>>>> origin/master



//................ Moddlewares
app.use("/auth",autheRoutes);
app.use("/home",homeRoutes);
<<<<<<< HEAD
<<<<<<< HEAD
app.use("/orders",OrderRoutes);

=======
>>>>>>> origin/master

//................ Views
app.set('view engine','ejs');
app.set('views','./views');

<<<<<<< HEAD
mongoose.connect("mongodb://127.0.0.1:27017/notlob");
var files_arr=fs.readdirSync(__dirname+"/models")
files_arr.forEach(function(file){
  require(__dirname+"/models/"+file);
});
=======
>>>>>>> origin/master

app.listen(8030);
