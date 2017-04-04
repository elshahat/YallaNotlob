var express= require("express");
var app=express();
//........... Routers
var autheRoutes=require("./controllers/auth");
var homeRoutes=require("./controllers/home");




//................ Moddlewares
app.use("/auth",autheRoutes);
app.use("/home",homeRoutes);

//................ Views
app.set('view engine','ejs');
app.set('views','./views');


app.listen(8030);
