import { Request,Response,NextFunction } from "express";
import jwt  from "jsonwebtoken";
import { User } from "./Interface";
const userChecking = (req:Request,res:Response)=>{
    let token = req.headers.authorization;
    console.log(token);
    let jwt_payload = jwt.verify(token!,"praveer") as User;
    return jwt_payload;
} 
export default userChecking