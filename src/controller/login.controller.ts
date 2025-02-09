import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcryptjs";
import * as TokenManager from "../utils/tokenManager";
import { response } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { Admin } from "../model/admin.model";

const activity = "ADMIN";

/**
 * @author Sivakumar R
 * @date 16-05-2024
 * @description This function handles admin login.
 */
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const adminDetails=await Admin.findOne({ $and: [{ isDeleted: false },{ email: req.body.email }]});
        if(adminDetails)
        {
            if(adminDetails["status"]===2){
                response(req,res,activity,'Level-1','Login-Admin',false,499,{},clientError.account.inActive);
            }
             else if(adminDetails["password"]!== req.body.password){
                response(req,res,activity,'Level-1','Login-Admin',false,200,{},"Password is MissMatch !")
                }else{             
                    const token=await TokenManager.CreateJWTToken({
                        id:adminDetails["_id"],
                        email:adminDetails["email"]
                    });
                    const details={}
                    details['_id']=adminDetails._id;
                    details['email']=adminDetails.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'Admin';
                    finalResult["adminDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-Admin',true,200,finalResult,clientError.success.loginSuccess)
                }
        }else{
            response(req,res,activity,'Level-1','Login-Admin',false,200,{},"Admin Not Registered");
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Login-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
