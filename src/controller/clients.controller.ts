import { validationResult } from "express-validator"
import { Admin } from "../model/admin.model";
import {client , ClientDocument } from "../model/client.model";
import { response } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";

var activity = "Clients"

export let createClient = async(req,res,next)=>{
    const errors = validationResult(req)
    if (errors.isEmpty()) {
       try {
        const clientDetails :ClientDocument = req.body;
        const admin = await Admin.findOne({ $and : [{isDeleted:false},{email:req.body.email}]});
        if (!admin) {
             const createData = new client(clientDetails);
             const insertData = await createData.save();
             response(req, res, activity, 'Level-2', 'create-client', true, 200, insertData, clientError.success.registerSuccessfully);
        } else {
            response(req, res, activity, 'Level-3', 'create-client', false, 422, {}, clientError.email.emailExist);
        }
       } catch (err:any) {
        response(req,res,activity,'Level-3','create-Contact-us',false,500,{},errorMessage.internalServer,err.message)
       }
    } else {
               response(req,res,activity,'Level-3','create-Contact-us',false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped))
        
    }
}