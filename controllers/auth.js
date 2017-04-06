var express=require("express");
var router=express.Router();
var bodyParser=require("body-parser");
var middleToParseRequestBody=bodyParser.urlencoded({extended:false});
var mongoose=require("mongoose");

var Name,Email,Password,Password2;

router.get("/",function(req,resp){
    resp.render("index",{signMsg:"trueSignIn"});
});
//............................ Sing IN ........................................
//*****************************************************************************
router.post("/signinAuth",middleToParseRequestBody,function(req,resp){
    Email=req.body.email;
    Password=req.body.password;
    console.log(Email)
    console.log(Password)
    var flag = false;
    mongoose.model("users").find({},{"_id":0,"email":1,"password":1},function(err,users ) {
        for(var i = 0; i <users.length; i++) {
            if(Email==users[i].email && Password==users[i].password){
                flag=true;
                console.log("SIGNIN Successfully");
                resp.render("home");
            }
        }
        if(!flag){
            console.log("ERROR: SIGNIN NOT Successfully!");
            resp.render("index",{signMsg:"falseSignIn"});
        }

    })
  });
//............................ Sing UP ........................................
//*****************************************************************************
  router.post("/signupAuth",middleToParseRequestBody,function(req,resp){
    Name=req.body.name;
    Email=req.body.email;
    Password = req.body.password1;
    Password2 = req.body.password2;

    console.log(req.body.name)
    console.log(req.body.email)

    if(checkPassword(Password,Password2)){
        console.log("Matched Password")
        var userModel= mongoose.model("users")
		var new_user= new userModel();
        new_user.name=Name;
		new_user.email=Email;
		new_user.password=Password;
		new_user.save(function(err){
            if (err){
                console.log("ERROR!!: Email Alrady Exist !!!");
                resp.render("index",{signMsg:"falseSignUp-Email"});
            }else {
                console.log("SIGNUP Successfully");
                resp.render("home");
            }
		});
    }else{
        console.log("Password NotMached");
        resp.render("index",{signMsg:"falseSignUp-password"});
    }

    });

    //............................ CheckMachingPassword .......................
    //*************************************************************************
    function checkPassword(pass1,pass2){
        if (pass1==pass2)
            return true
        else
            return false
    }
    

module.exports=router;
