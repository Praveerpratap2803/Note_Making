import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
const checkingTokenPresent = (req:Request,res:Response,next:NextFunction)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(400).json({message:"token is missing"})
    }
    next()
} 
export default checkingTokenPresent
