var express=require("express");
var bodyParser=require("body-parser");
var DBFunctions = require("./DBfunctions.js")

var router=express.Router();
var middleToParseRequestBody=bodyParser.urlencoded({extended:false});
var mongoose=require("mongoose");

//............................ friends Page ........................................
//*****************************************************************************
router.get("/",function(req,resp){
    var friendList=DBFunctions.getFriendsEmail(req.session.email)
    resp.render('friends',{FrindsEmail:friendList});
    //DBFunctions.getFriendsName(resp,req.session.email)
})


module.exports=router;
