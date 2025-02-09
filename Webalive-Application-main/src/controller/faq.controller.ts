import { Faq,FaqDocument } from "../model/faq.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";
 
var activity = "Faq";
/**
 * @author Balaji Murahari
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function use faq post
 * 
  * */

export let saveFaq = async (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        try{
            const createFaq:FaqDocument=req.body;
            const createData = new Faq(createFaq);
            const insertData = await createData.save();
            response(req,res,activity,'Level-2','Save-Faq',true,200,insertData,clientError.success.savedSuccessfully);
          }
          catch(err:any)
          {
            response(req,res,activity,'Level-3','Save-Faq',false,500,{},errorMessage.internalServer,err.message);
          }
    }
    else
    {
        response(req,res,activity,'Save-Faq','Level-3',false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Balaji Murahari
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all faq
 * 
 */

export let getAllFaq = async (req,res,next)=>{
    try{
        const data = await Faq.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-Faq',true,200,data,clientError.success.fetchedSuccessfully);
    }
    catch(err:any)
    {
        response(req,res,activity,'Level-3','GetAll-Faq',false,500,{},errorMessage.internalServer,err.message)
    }
}