var express=require("express");
// Load MongoDB Driver
var mongoose=require("mongoose")

var fs=require("fs");
var app=express();

app.use("/",HomeRoutes);
app.set('view engine','ejs')
app.set('views','./views')

// open connection with mongodb
// Server IP : Port Numner / Database Name..




app.listen(8090);
