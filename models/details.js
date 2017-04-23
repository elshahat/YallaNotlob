var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var details=new Schema({
  person:{type:String,ref:'users'},
  orderId:{type:Number,ref:'orders'},
  itemName:String,
  price:Number,
  amount:Number,
  comment:String,
})
// ORM
mongoose.model("details",details)
