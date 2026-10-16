import mongoose from "mongoose";
const schema = new mongoose.Schema({
  sku:{type:String,required:true,unique:true,uppercase:true,trim:true,index:true},
  name:{type:String,required:true,trim:true,index:true},
  description:{type:String,default:""},
  category:{type:String,required:true,trim:true},
  purchasePrice:{type:Number,required:true,min:0},
  sellingPrice:{type:Number,required:true,min:0},
  stock:{type:Number,default:0,min:0,validate:Number.isInteger},
  reorderLevel:{type:Number,default:5,min:0,validate:Number.isInteger},
  active:{type:Boolean,default:true}
},{timestamps:true});
schema.index({name:"text",sku:"text"});
export default mongoose.model("Product",schema);
