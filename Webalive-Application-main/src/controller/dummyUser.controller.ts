import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Dummy, DummyDocument } from "../model/dummyUser.model";

var activity = "DummyUser";

/**
 * @author Haripriyan K
 * @date 10-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Dummy User.
 */
export let createDummyUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const dummyDetails:DummyDocument = req.body
                 const uniqueId = Math.floor(Math.random() * 10000);
                dummyDetails.userName=dummyDetails.fullName+"_"+uniqueId
                const createData = new Dummy(dummyDetails);
                let insertData = await createData.save();

                const result = {}
                result['_id'] = insertData._id
                result['fullName'] = insertData.fullName;
                let finalResult = {};
                finalResult["loginType"] = 'dummmy users';
                finalResult["dummyDetails"] = result;
                response(req, res, activity, 'Level-2', 'Save-DummyUser', true, 200, finalResult, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-DummyUser', false, 500, {}, errorMessage.internalServer, err.message);
        }          
    } else {
        response(req, res, activity, 'Level-3', 'Save-DummyUser ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

/**
 * @author Haripriyan K
 * @date 10-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Dummy Users.
 */
export let getAllDummyUsers = async (req, res, next) => {
    try {
        const dummyData = await Dummy.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-DummyUsers', true, 200, dummyData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-DummyUsers', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Haripriyan K
 * @date 10-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Dummy Users count.
 */
export let dummyUsersCount = async (req, res, next) => {
    try {
        const dummyData = await Dummy.find({}).count()
        response(req, res, activity, 'Level-2', 'Get-DummyUsers', true, 200, dummyData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-DummyUsers', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
