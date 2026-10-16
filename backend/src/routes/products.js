import {Router} from "express";
import Product from "../models/Product.js";
import {auth,adminOnly} from "../middleware/auth.js";
const r=Router(); r.use(auth);
r.get("/",async(req,res,next)=>{try{
 const {search="",category="",stockStatus="",page="1",limit="20"}=req.query;
 const q={}; if(category)q.category=category;
 if(search)q.$or=[{name:{$regex:String(search),$options:"i"}},{sku:{$regex:String(search),$options:"i"}}];
 if(stockStatus==="low")q.$expr={$lte:["$stock","$reorderLevel"]};
 if(stockStatus==="out")q.stock=0;
 const p=Math.max(1,Number(page)||1), l=Math.min(100,Math.max(1,Number(limit)||20));
 const [items,total]=await Promise.all([Product.find(q).sort({updatedAt:-1}).skip((p-1)*l).limit(l),Product.countDocuments(q)]);
 res.json({items,total,page:p,pages:Math.ceil(total/l)});
}catch(e){next(e)}});
r.get("/:id",async(req,res,next)=>{try{const p=await Product.findById(req.params.id);if(!p)return res.status(404).json({message:"Product not found"});res.json(p)}catch(e){next(e)}});
r.post("/",adminOnly,async(req,res,next)=>{try{
 const d=req.body; if(!d.sku||!d.name||!d.category||!Number.isFinite(+d.purchasePrice)||!Number.isFinite(+d.sellingPrice))return res.status(400).json({message:"SKU, name, category and valid prices are required"});
 const p=await Product.create({sku:d.sku,name:d.name,description:d.description,category:d.category,purchasePrice:+d.purchasePrice,sellingPrice:+d.sellingPrice,stock:Math.max(0,Math.floor(+d.stock||0)),reorderLevel:Math.max(0,Math.floor(+d.reorderLevel||0))});
 res.status(201).json(p);
}catch(e){next(e)}});
r.put("/:id",adminOnly,async(req,res,next)=>{try{
 const allowed=["sku","name","description","category","purchasePrice","sellingPrice","reorderLevel"];
 const d={}; for(const k of allowed)if(req.body[k]!==undefined)d[k]=req.body[k];
 const p=await Product.findByIdAndUpdate(req.params.id,d,{new:true,runValidators:true});if(!p)return res.status(404).json({message:"Product not found"});res.json(p);
}catch(e){next(e)}});
r.patch("/:id/status",adminOnly,async(req,res,next)=>{try{const p=await Product.findByIdAndUpdate(req.params.id,{active:!!req.body.active},{new:true});if(!p)return res.status(404).json({message:"Product not found"});res.json(p)}catch(e){next(e)}});
export default r;
