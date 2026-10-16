import {Router} from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import {auth,adminOnly} from "../middleware/auth.js";
const r=Router();r.use(auth,adminOnly);
function dateQuery(q){const d={};if(q.from||q.to){d.createdAt={};if(q.from)d.createdAt.$gte=new Date(q.from);if(q.to)d.createdAt.$lte=new Date(q.to+"T23:59:59.999Z")}return d}
r.get("/sales",async(req,res,next)=>{try{const match=dateQuery(req.query);const [agg,count]=await Promise.all([Sale.aggregate([{$match:match},{$group:{_id:null,revenue:{$sum:"$total"},subtotal:{$sum:"$subtotal"},discount:{$sum:"$discount"},tax:{$sum:"$tax"}}}]),Sale.countDocuments(match)]);res.json({transactionCount:count,revenue:agg[0]?.revenue||0,subtotal:agg[0]?.subtotal||0,discount:agg[0]?.discount||0,tax:agg[0]?.tax||0})}catch(e){next(e)}});
r.get("/profit",async(req,res,next)=>{try{const match=dateQuery(req.query);const agg=await Sale.aggregate([{$match:match},{$unwind:"$items"},{$group:{_id:null,revenue:{$sum:"$items.lineTotal"},cost:{$sum:{$multiply:["$items.purchasePrice","$items.quantity"]}}}},{$project:{_id:0,revenue:1,cost:1,grossProfit:{$subtract:["$revenue","$cost"]}}}]);res.json(agg[0]||{revenue:0,cost:0,grossProfit:0})}catch(e){next(e)}});
r.get("/dashboard",async(req,res,next)=>{try{
 const start=new Date();start.setHours(0,0,0,0);
 const [activeProducts,stockAgg,lowStock,todayAgg,transactionCount,top]=await Promise.all([
 Product.countDocuments({active:true}),Product.aggregate([{$match:{active:true}},{$group:{_id:null,units:{$sum:"$stock"}}}]),
 Product.countDocuments({active:true,$expr:{$lte:["$stock","$reorderLevel"]}}),
 Sale.aggregate([{$match:{createdAt:{$gte:start}}},{$group:{_id:null,revenue:{$sum:"$total"},profit:{$sum:{$sum:{$map:{input:"$items",as:"i",in:{$multiply:[{$subtract:["$$i.sellingPrice","$$i.purchasePrice"]},"$$i.quantity"]}}}}}}}]),
 Sale.countDocuments({createdAt:{$gte:start}}),
 Sale.aggregate([{$unwind:"$items"},{$group:{_id:"$items.product",name:{$first:"$items.name"},units:{$sum:"$items.quantity"},revenue:{$sum:"$items.lineTotal"}}},{$sort:{units:-1}},{$limit:5}])
 ]);
 res.json({activeProducts,totalUnits:stockAgg[0]?.units||0,lowStockCount:lowStock,todayRevenue:todayAgg[0]?.revenue||0,todayProfit:todayAgg[0]?.profit||0,transactionsToday:transactionCount,topSelling:top});
}catch(e){next(e)}});export default r;
