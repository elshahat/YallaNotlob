var express=require("express");
var mongoose=require("mongoose");
var router=express.Router();


router.get("/",function(req,resp){
  /* Update
  mongoose.model("users").update({},{},{},function(){

  })*/
  /* Remove
  mongoose.model("users").remove({},function(){

  })*/
  email="a@iti.com"
  mongoose.model("orders").find({"ownerEmail":"a@iti.com"},{"_id":false,"date":true},function(err,orders){
    // mongoose.model("orders").populate(data,{path:"ownerEmail"},function(err,orders){
    for(var i = 0; i <orders.length; i++) {
       console.log(orders[i].date);
             resp.json(orders[i].date);
        }

    // })
    //resp.render("home/index",{"products_data":data});
  })
})




module.exports=router;
