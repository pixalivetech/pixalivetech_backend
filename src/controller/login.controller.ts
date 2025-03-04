import { validationResult } from "express-validator"
import { response } from "../helper/commonResponseHandler";
import { decrypt } from "../helper/Encryption";
import * as TokenManager from "../utils/tokenManager";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { Task, TaskDocument } from "../model/task.model";

var activity = "Login User"

export let userLogin = async (req, res,next)=>{
    const errors  = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const taskDetails :TaskDocument = req.body ;
            const user = await Task.findOne({ $and : [{isDeleted:false},{email:req.body.email}]})
        if (user) {
            const pass = await decrypt(user["password"])
            console.log(pass);
            if (pass==req.body.password) {
                 const token = await TokenManager.CreateJWTToken({
                    id: user["_id"],
                    name: user["name"],
                 });    
            let finalResult = {};
            finalResult["loginType"] = 'User';
            finalResult["userName"] = user.name;
            finalResult["email"] = user.email;
            finalResult["token"] = token;
             response(req, res, activity, 'Level-2', 'user-login', true, 200, finalResult,clientError.success.loginSuccess) 
            } else {
            response(req,res,activity,'Level-3','user-Login',false,422,{},clientError.email.password)
            }
        } else {
            response(req, res, activity, 'Level-3', 'user-login', false, 422, {}, "user is not found");
        }
        
        } catch (err:any) {
            response(req,res,activity,'Level-3','user-login',false,422,{},errorMessage.internalServer,err.message);
        }
     } 
     else {
        response(req, res, activity, 'Level-3', 'user-login', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
 }

 export let verifyOtp = async(req,res,next) =>{
   try {
    const taskDetails :TaskDocument = req.body ;
    const user = await Task.findOne({ $and : [{isDeleted:false},{email:req.body.email}]})
    if (user) {
        if(user.otp===req.body.otp){
            response(req, res, activity, 'Level-2', 'user-login', true, 200,{},clientError.otp.otpVerifySuccess) 
        }
        else{
            response(req, res, activity, 'Level-3', 'user-login', true, 200, {},clientError.otp.otpDoestMatch) ;
        }
    } else {
        response(req, res, activity, 'Level-3', 'user-login', false, 422, {}, "user is not found");

    }
   } catch (err:any) {
    response(req,res,activity,'Level-3','user-login',false,422,{},errorMessage.internalServer,err.message);
   }
 }
 

   