var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var orderDetails=new Schema({
  person:{type:String,ref:'users'},
  itemName:String,
  price:Number,
  amount:Number,
  comment:String,
})
// ORM
mongoose.model("orderDetails",orderDetails)
