import { Terms,TermsDocument } from "../model/terms.models";
import {response }from "../helper/commonResponseHandler";
import {errorMessage,clientError} from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "Terms";

/**
 * @author Balaji Murahari
 * @date 05-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function terms and conditions above the company
 * 
  * */

export let saveTerms = async (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        try{
            const createTerms:TermsDocument=req.body;
            const createData = new Terms(createTerms);
            const insertData = await createData.save();
            response(req,res,activity,'Level-2','Save-Terms',true,200,insertData,clientError.success.savedSuccessfully);
        }
        catch(err:any)
        {
            response(req,res,activity,'Level-3','Save-Terms',false,500,{},errorMessage.internalServer,err.message)
        }
    }
    
    else 
    {
        response(req, res, activity, 'Save-Terms', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Balaji Murahari
 * @date 05-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all TermsConditions
 * 
 */
export let getAllTerms = async(req,res,next)=>{
    try{

        const data = await Terms.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-Terms',true,200,data,clientError.success.fetchedSuccessfully)
     }
     catch(err:any){
        response(req,res,activity,'Level-3','GetAll-Terms',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Balaji Murahari
 * @date 09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update TermsConditions
 * 
 */


export let updateTerms = async (req,res,next)=>{
    try{
        const updateData : TermsDocument = req.body;
        const updatedTerms = await Terms.updateMany({
            $set:{
                termsAndCondition:updateData.termsAndCondition
            }
            
        })
        response(req,res,activity,'Level-1','Update-Terms',true,200,updatedTerms,clientError.success.updateSuccess)
    }catch(err:any){
        response(req, res, activity,'Level-3','Update-Terms', false, 500, {}, errorMessage.internalServer, err.message)
    }
} 



