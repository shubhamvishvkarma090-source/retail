import {Router} from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Movement from "../models/InventoryMovement.js";
import {auth} from "../middleware/auth.js";
const r=Router();r.use(auth);
r.get("/low-stock",async(req,res,next)=>{try{res.json(await Product.find({active:true,$expr:{$lte:["$stock","$reorderLevel"]}}).sort({stock:1}))}catch(e){next(e)}});
r.get("/movements",async(req,res,next)=>{try{
 const page=Math.max(1,+req.query.page||1),limit=Math.min(100,+req.query.limit||30);
 const items=await Movement.find().populate("product","name sku").populate("performedBy","name").sort({createdAt:-1}).skip((page-1)*limit).limit(limit);
 res.json({items,total:await Movement.countDocuments(),page, pages:Math.ceil(await Movement.countDocuments()/limit)});
}catch(e){next(e)}});
r.get("/movements/:id",async(req,res,next)=>{try{const m=await Movement.findById(req.params.id).populate("product").populate("performedBy","name");if(!m)return res.status(404).json({message:"Movement not found"});res.json(m)}catch(e){next(e)}});
r.post("/adjustments",async(req,res,next)=>{const session=await mongoose.startSession();try{
 const {productId,quantity,type="INCREASE",reason="Manual adjustment"}=req.body;const qty=Number(quantity);
 if(!mongoose.isValidObjectId(productId)||!Number.isInteger(qty)||qty<=0||!["RECEIVE","INCREASE","DECREASE"].includes(type))return res.status(400).json({message:"Valid product, positive integer quantity and adjustment type required"});
 let result; await session.withTransaction(async()=>{
  const p=await Product.findById(productId).session(session);if(!p)throw Object.assign(new Error("Product not found"),{status:404});
  const delta=type==="DECREASE"?-qty:qty;if(p.stock+delta<0)throw Object.assign(new Error("Adjustment would make stock negative"),{status:409});
  const prev=p.stock;p.stock+=delta;await p.save({session});
  const [m]=await Movement.create([{product:p._id,type,quantityChange:delta,previousStock:prev,resultingStock:p.stock,reason:String(reason).slice(0,250),performedBy:req.user._id}],{session});result={product:p,movement:m};
 });res.status(201).json(result);
}catch(e){next(e)}finally{await session.endSession()}});export default r;
