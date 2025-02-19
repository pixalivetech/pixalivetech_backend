import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { generate, response, sendEmailOtp } from "../helper/commonResponseHandler";
import { encrypt,decrypt, hashPassword } from "../helper/Encryption";
import * as TokenManager from "../utils/tokenManager";
import { Panel, PanelDocument } from "../model/adminPanel.model";


var activity = "Admin Panel"

/**
 * @author Kaaviyan 
 * @date 08-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create admin panel.
 */ 

// 1. create api 
export let createAdminPAnel = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panelData = await Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!panelData) {
                const panelDetails: PanelDocument = req.body; 
                panelDetails.password =await encrypt(panelDetails.password);
                const createData = new Panel(panelDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["Panel"],
                 });
                const result = {}
                result['_id'] = insertData._id
                result['PanelName'] = insertData.userName;
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["ComapanyDetails"] = insertData.companyName;
                finalResult["panelDetails"] = result;
                finalResult["token"] = token;
                response(req, res, activity, 'Level-2', 'create-Admin-panel', true, 200, finalResult, clientError.success.registerSuccessfully);
                } else {
                    response(req, res, activity, 'Level-3', 'create-Admin-panel', true, 422, {},clientError.email.emailExist);
                }
            }
         catch (err: any) {
            response(req, res, activity, 'Level-3', 'create-Admin-panel', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'create-Admin-panel', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




/**
 * @author kaaviyan G S
 * @date 11-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Users.
 */
export let getAllAdmin = async (req, res, next) => {
    try {
        const usersData = await Panel.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-all-admin', true, 200, usersData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-all-admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author kaaviyan G S
 * @date 11-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get a single Users.
 */
export let getSingleAdmin = async (req, res, next) => {
    try {
        const data = await Panel.findById({ _id: req.body._id })
        response(req, res, activity, 'Level-1', 'Get-Single-Admin', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Admin', false, 500, {}, errorMessage.internalServer, err.message);

    }
}

/**
 * @author kaaviyan G S
 * @date  12-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete admin .
 */

export let deletedAdmin = async (req, res, next) => {
    try {
        const data = await Panel.findOneAndUpdate({ _id: req.body._id },{ $set:
                 { isDeleted: true, 
                    modifiedBy: req.body.fullName,
                     modifiedOn: new Date() 
                    } });
        response(req, res, activity, 'Level-2', 'Delete-Admin', true, 200, data, clientError.success.deleteSuccess);
    } catch (error: any) {
        response(req, res, activity, 'Level-3', 'Delete-Admin', false, 500, {}, errorMessage.internalServer, error.message);
    }
}
