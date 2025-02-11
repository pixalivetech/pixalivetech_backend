import { validationResult } from "express-validator"
import { response } from "../helper/commonResponseHandler";
import { decrypt } from "../helper/Encryption";
import * as TokenManager from "../utils/tokenManager";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { Panel } from "../model/adminPanel.model";

var activity = "Panel Login"

export let panelLogin = async (req, res,next)=>{
    const errors  = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panels = await Panel.findOne({ $and : [{isDeleted:false},{email:req.body.email}]})
        if (panels) {
            const pass = await decrypt(panels["password"])
            console.log(pass);
            if (pass!==req.body.password) {
              response(req,res,activity,'Level-3','admin-panel-Login',false,422,{},clientError.email.password)
            } else {
                const token = await TokenManager.CreateJWTToken({
                                    id: Panel["_id"],
                                    name: Panel["Panel"],
                                 });
                            let finalResult = {};
                            finalResult["loginType"] = 'company';
                            finalResult["companyDetails"] = panels.companyName;
                            finalResult["email"] = panels.email;
                            finalResult["token"] = token;
            response(req, res, activity, 'Level-2', 'admin-panel-login', true, 200, finalResult,clientError.success.loginSuccess) 
            }
        } else {
            response(req, res, activity, 'Level-3', 'admin-panel-login', false, 422, {}, "panel is not found");
        }
        
        } catch (err:any) {
            response(req,res,activity,'Level-3','admin-panel-login',false,422,{},errorMessage.internalServer,err.message);
        }
     } 
     else {
        response(req, res, activity, 'Level-3', 'CompanyLogin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
 } 

