import {Router} from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Movement from "../models/InventoryMovement.js";
import {auth} from "../middleware/auth.js";
const r=Router();r.use(auth);
r.post("/",async(req,res,next)=>{const session=await mongoose.startSession();try{
 const {items,paymentMethod="Cash",discount=0,taxRate=0}=req.body;
 if(!Array.isArray(items)||!items.length)return res.status(400).json({message:"At least one cart item is required"});
 if(!["Cash","Card","UPI"].includes(paymentMethod))return res.status(400).json({message:"Invalid payment method"});
 const disc=Number(discount),rate=Number(taxRate);if(!Number.isFinite(disc)||disc<0||!Number.isFinite(rate)||rate<0||rate>100)return res.status(400).json({message:"Invalid discount or tax rate"});
 let sale;
 await session.withTransaction(async()=>{
  const saleItems=[];let subtotal=0;
  for(const line of items){
   if(!mongoose.isValidObjectId(line.productId)||!Number.isInteger(Number(line.quantity))||Number(line.quantity)<1)throw Object.assign(new Error("Invalid product or quantity"),{status:400});
   const p=await Product.findOneAndUpdate({_id:line.productId,active:true,stock:{$gte:Number(line.quantity)}},{$inc:{stock:-Number(line.quantity)}},{new:true,session});
   if(!p)throw Object.assign(new Error("Product is unavailable or stock is insufficient"),{status:409});
   const prev=p.stock+Number(line.quantity), qty=Number(line.quantity), lineTotal=Number((p.sellingPrice*qty).toFixed(2));subtotal+=lineTotal;
   saleItems.push({product:p._id,sku:p.sku,name:p.name,purchasePrice:p.purchasePrice,sellingPrice:p.sellingPrice,quantity:qty,lineTotal});
   await Movement.create([{product:p._id,type:"SALE",quantityChange:-qty,previousStock:prev,resultingStock:p.stock,reason:"Sale checkout",performedBy:req.user._id}],{session});
  }
  if(disc>subtotal)throw Object.assign(new Error("Discount cannot exceed subtotal"),{status:400});
  const taxable=subtotal-disc,tax=Number((taxable*rate/100).toFixed(2)),total=Number((taxable+tax).toFixed(2));
  const invoiceNumber=`INV-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  [sale]=await Sale.create([{invoiceNumber,items:saleItems,subtotal:Number(subtotal.toFixed(2)),discount:disc,tax,total,paymentMethod,cashier:req.user._id}],{session});
 });res.status(201).json(sale);
}catch(e){next(e)}finally{await session.endSession()}});
r.get("/",async(req,res,next)=>{try{const page=Math.max(1,+req.query.page||1),limit=Math.min(100,+req.query.limit||20);const q={};if(req.query.from||req.query.to){q.createdAt={};if(req.query.from)q.createdAt.$gte=new Date(req.query.from);if(req.query.to)q.createdAt.$lte=new Date(req.query.to+"T23:59:59.999Z")}
 const [items,total]=await Promise.all([Sale.find(q).populate("cashier","name").sort({createdAt:-1}).skip((page-1)*limit).limit(limit),Sale.countDocuments(q)]);res.json({items,total,page,pages:Math.ceil(total/limit)})}catch(e){next(e)}});
r.get("/:id",async(req,res,next)=>{try{const s=await Sale.findById(req.params.id).populate("cashier","name");if(!s)return res.status(404).json({message:"Sale not found"});res.json(s)}catch(e){next(e)}});export default r;
