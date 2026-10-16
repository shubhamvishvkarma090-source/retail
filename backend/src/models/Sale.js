import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
  sku:{type:String,required:true}, name:{type:String,required:true},
  purchasePrice:{type:Number,required:true}, sellingPrice:{type:Number,required:true},
  quantity:{type:Number,required:true,min:1}, lineTotal:{type:Number,required:true}
},{_id:false});
const schema = new mongoose.Schema({
  invoiceNumber:{type:String,unique:true,required:true,index:true},
  items:{type:[itemSchema],required:true},
  subtotal:{type:Number,required:true}, discount:{type:Number,default:0},
  tax:{type:Number,default:0}, total:{type:Number,required:true},
  paymentMethod:{type:String,enum:["Cash","Card","UPI"],default:"Cash"},
  paymentStatus:{type:String,enum:["Paid","Cancelled"],default:"Paid"},
  cashier:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true});
export default mongoose.model("Sale",schema);
