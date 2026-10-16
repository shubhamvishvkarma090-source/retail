import {Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {auth} from "../middleware/auth.js";
const r=Router();
r.post("/login",async(req,res,next)=>{try{
 const email=String(req.body.email||"").toLowerCase().trim();
 const user=await User.findOne({email}).select("+passwordHash");
 if(!user||!await bcrypt.compare(String(req.body.password||""),user.passwordHash)) return res.status(401).json({message:"Email or password is incorrect"});
 const token=jwt.sign({sub:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"8h"});
 res.json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}});
}catch(e){next(e)}});
r.get("/me",auth,(req,res)=>res.json({user:{id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role}}));
export default r;
