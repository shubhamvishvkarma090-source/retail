import "dotenv/config";
import bcrypt from "bcryptjs";
import {connectDB} from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
await connectDB();
for(const [name,email,password,role] of [
 ["Demo Admin","admin@retail.local","Admin123!","Admin"],
 ["Demo Staff","staff@retail.local","Staff123!","Staff"]
]){
 const passwordHash=await bcrypt.hash(password,12);
 await User.findOneAndUpdate({email},{name,email,passwordHash,role},{upsert:true,new:true,setDefaultsOnInsert:true});
}
const products=[
 {sku:"GRC-001",name:"Premium Basmati Rice 5kg",category:"Grocery",purchasePrice:310,sellingPrice:399,stock:42,reorderLevel:10},
 {sku:"GRC-002",name:"Cold Pressed Mustard Oil 1L",category:"Grocery",purchasePrice:125,sellingPrice:169,stock:8,reorderLevel:10},
 {sku:"ELC-001",name:"Wireless Bluetooth Speaker",category:"Electronics",purchasePrice:850,sellingPrice:1299,stock:17,reorderLevel:5},
 {sku:"HOM-001",name:"Stainless Steel Water Bottle",category:"Home",purchasePrice:180,sellingPrice:299,stock:3,reorderLevel:8},
 {sku:"GRC-003",name:"Organic Brown Sugar 1kg",category:"Grocery",purchasePrice:65,sellingPrice:95,stock:24,reorderLevel:8}
];
for(const p of products)await Product.findOneAndUpdate({sku:p.sku},p,{upsert:true,new:true,setDefaultsOnInsert:true});
console.log("Seed complete. Development accounts: admin@retail.local / Admin123! and staff@retail.local / Staff123!");
process.exit(0);
