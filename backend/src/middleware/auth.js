import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function auth(req,res,next){
 try{
  const token=(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
  if(!token) return res.status(401).json({message:"Authentication required"});
  const payload=jwt.verify(token,process.env.JWT_SECRET);
  const user=await User.findById(payload.sub);
  if(!user) return res.status(401).json({message:"Invalid session"});
  req.user=user; next();
 }catch(e){ return res.status(401).json({message:"Invalid or expired token"}); }
}
export const adminOnly=(req,res,next)=>req.user?.role==="Admin"?next():res.status(403).json({message:"Admin access required"});
