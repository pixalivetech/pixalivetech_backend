import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { generate, response, sendEmailOtp } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { Company, CompanyDocument } from "../model/company.model";


var activity = "Company"

/**
 * @author Kaaviyan 
 * @date 08-02-2025
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Company owner.
 */ 

// 1. create api 
export let CompanyProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panelData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!panelData) {
                const CompanyDetails: CompanyDocument = req.body;
                CompanyDetails.companyCode = generate(6);  
                const userotp =   Math.floor(1000 + Math.random() * 9999);
                CompanyDetails.otp = userotp ;
                const createData = new Company(CompanyDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["Company"],
                 });
                const result = {}
                result['_id'] = insertData._id
                result['CompanyName'] = insertData.CompanyName;
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["SignUp"] = 'Company';
                finalResult["CompanyDetails"] = result;
                finalResult["token"] = token;
                sendEmailOtp(insertData.email,insertData.otp)
                response(req, res, activity, 'Level-2', 'Company-Profile', true, 200, result, clientError.success.registerSuccessfully);
                } else {
                    response(req, res, activity, 'Level-3', 'Company-Profile', true, 422, {},clientError.email.emailNotVerified);
                }
            }
         catch (err: any) {
            response(req, res, activity, 'Level-3', 'User-Profile', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'User-Profile', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}