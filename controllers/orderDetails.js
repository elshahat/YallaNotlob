var express=require("express");
var router=express.Router();
var bodyParser=require("body-parser");
var DBFunctions = require("./DBfunctions.js")
var middleToParseRequestBody=bodyParser.urlencoded({extended:false});


router.get("/",middleToParseRequestBody,function(req,resp){
resp.render("orderDetails");

});

module.exports=router;
