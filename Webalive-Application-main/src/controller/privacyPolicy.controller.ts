import { validationResult } from "express-validator";
import { response } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";  
import { privacy, privacyDocument } from '../model/privacyPolicy.model'

var activity="PrivacyPolicy";

/**
 * @author Haripriyan K
 * @date 05-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create Privacy Policy.
 */
export let savePrivacy = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const createPrivacy:privacyDocument = req.body
            const createData = new privacy(createPrivacy)    
            const insertData = await createData.save()
            response(req, res, activity,'Level-2','Save-privacy', true, 200, insertData, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity,'Level-3','Save-privacy', false, 500, {}, errorMessage.internalServer, err.message)
        }
    }
    else {
        response(req, res, activity, 'Save-Url', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }  
}

/**
 * @author Haripriyan K
 * @date 05-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Privacy Policy.
 */
export let getAllPrivacy = async (req, res, next) => {
    try {
        const showData = await privacy.find({isDeleted:false})
        response(req, res, activity,'Level-1','GetAll-PrivacyPolicy', true, 200, showData, clientError.success.fetchedSuccessfully)
    } catch (err:any){
        response(req, res, activity,'Level-3','GetAll-PrivacyPolicy', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
 * @author Haripriyan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Privacy Policy.
 */
export let updatePrivacy = async (req, res, next) => {
    try{
        const privacyData : privacyDocument = req.body
        const updatePrivacy = await privacy.updateMany({
            $set:{
                privacyPolicy:privacyData.privacyPolicy
            }
        })
        response(req, res, activity,'Level-1','Update-PrivacyPolicy', true, 200, updatePrivacy, clientError.success.updateSuccess)
    } catch (err:any){
        response(req, res, activity,'Level-3','Update-PrivacyPolicy', false, 500, {}, errorMessage.internalServer, err.message)
    }
}