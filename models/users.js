var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var users=new Schema({
  email:String,
  password:String,
  image:String,
  name:String,
  groupName:[{ type : String, ref: 'groups' }],
  friend:[{type:String,ref:'users'}]
})
// ORM
mongoose.model("users",users)
