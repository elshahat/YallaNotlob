var express=require("express");
var router=express.Router();
var bodyParser=require("body-parser");
var DBFunctions = require("./DBfunctions.js")

var middleToParseRequestBody=bodyParser.urlencoded({extended:false});


router.get("/",function(req,resp){
    var userEmail = req.session.email
    console.log("userEmail: ",userEmail);
    var myGroupList=DBFunctions.getMyGroups(userEmail);   //groupsDBFunction1
    var groupMembersList= DBFunctions.getGroupObject(myGroupList[0],userEmail)
    console.log("groupMembersList: ",groupMembersList);
    if(groupMembersList==undefined){
        var memberList=""
    }else{
        var memberList=groupMembersList.members;
    }
    console.log("myGroupList ",myGroupList);
    console.log("myGroupList[0] ",myGroupList[0])
    resp.render("groups",{myGroups:myGroupList,fristGroup:myGroupList[0],firstGroupMembers:memberList});
});



module.exports=router;
