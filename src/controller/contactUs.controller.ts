
import { validationResult } from "express-validator";
import { response } from "../helper/commonResponseHandler";
import { clientError,errorMessage } from "../helper/ErrorMessage";
import { contact, contactDocument } from "../model/contactUs.model";

 
var activity="contact us"
 
/**
 * @author Kaaviyan  
 * @date 11-02-2025
 * @param {Object} req
 * @param {Objzect} res
 * @param {Function} next
 * @description This function is used to create contact user
 */
 
export let creeateContactUs = async(req,res,next)=>{
const errors = validationResult(req)
if(errors.isEmpty()){
    try {
        const contactDetails:contactDocument = req.body;
        const createData = new contact(contactDetails);
        const insertData = await createData.save();
        response(req, res, activity, 'Level-2', 'create-contact-us', true, 200, insertData, clientError.success.registerSuccessfully);
        
    }
    catch (err:any) {
        response(req,res,activity,'Level-3','create-Contact-us',false,500,{},errorMessage.internalServer,err.message)
    }
}
    else{
       response(req,res,activity,'Level-3','create-Contact-us',false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped))
    }
}

/**
 * @author Kaaviyan  G S
 * @date 11-02-2025
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This function used to get all user contactUs details
 */
export let getAllContactUs = async(req,res,next)=>{
    try{
        const getContactUs =await contact.find({isDeleted:false})
        response(req,res,activity,"level-1","fetch-all-Contact-Us",true,200,getContactUs,clientError.success.fetchedSuccessfully)
    }
    catch(err:any){
        response(req,res,activity,"level-3","fetch-all-Contac-tUs",false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Kaaviyan
 * @date 02-04-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to find single contact user.
 */
export let getSingle = async( req, res, next ) =>{
    try {
            const single = await contact.findOne({ _id: req.body._id })
            if (single) {
                response(req, res, activity, 'Level-2', 'Fetch-single-contact', true, 200, single, clientError.success.fetchedSuccessfully);
            } else {
                response(req, res, activity, 'Level-3', 'Fetch-single-contact', true, 422, {}, clientError.user.userDontExist);
            }
            } 
    catch (err:any) {
            response(req, res, activity, 'Level-3', 'Fetch-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


