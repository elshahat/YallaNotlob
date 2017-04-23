var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var notifications=new Schema({
  recieverEmail:{type:String,ref:'users'},
  senderEmail:{type:String,ref:'users'},
  type:String,
  from:{type:String,ref:'orders'},
  orderId:{type:Number,ref:'orders'}
})
// ORM
mongoose.model("notifications",notifications)
