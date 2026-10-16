import mongoose from "mongoose";
const schema = new mongoose.Schema({
 product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true,index:true},
 type:{type:String,enum:["RECEIVE","INCREASE","DECREASE","SALE","RETURN"],required:true},
 quantityChange:{type:Number,required:true}, previousStock:{type:Number,required:true},
 resultingStock:{type:Number,required:true}, reason:{type:String,required:true},
 performedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 referenceId:{type:mongoose.Schema.Types.ObjectId,default:null}
},{timestamps:true});
export default mongoose.model("InventoryMovement",schema);
