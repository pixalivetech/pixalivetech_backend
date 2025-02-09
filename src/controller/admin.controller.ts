
import { Admin } from '../model/admin.model';
import { response } from '../helper/commonResponseHandler';
import { errorMessage, clientError } from '../helper/ErrorMessage';


const activity = 'ADMIN';


/**
 * @author Sivakumar R
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all User.
 */
export let getAdmin = async (req, res, next) => {
    try {
        const AdminList = await Admin.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-User', true, 200, AdminList, clientError.success.success);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
export let getSingleAdmin = async (req, res, next) => {
    try {
        const AdminList = await Admin.findOne({ isDeleted: false }, { _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-User', true, 200, AdminList, clientError.success.success);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}




