var express=require("express");
var bodyParser=require("body-parser");
var DBFunctions = require("./DBfunctions.js")

var router=express.Router();
var middleToParseRequestBody=bodyParser.urlencoded({extended:false});

router.get("/",function(req,resp){
    var orders = DBFunctions.getLeatestOrders(req.session.email);    //return [typeList,detaList];
    resp.render("home",{Types:orders[0],Dates:orders[1]});
});

module.exports=router;
