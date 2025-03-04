import { WorkingSpaceDocument,WorkingSpace } from "../model/coworkingSpace.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "WorkingSpace";
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let saveWorkingSpace = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createWorkingSpace: WorkingSpaceDocument = req.body;
            const createData = new WorkingSpace(createWorkingSpace);
            const insertData = await createData.save();
            response( req,res,activity,"Level-2","Save-WorkingSpace",true,200,insertData,clientError.success.savedSuccessfully );
        } catch (err: any) {
            response( req,res,activity,"Level-3","Save-WorkingSpace",false,500,{},errorMessage.internalServer,err.message );
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-WorkingSpace', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let getWorkingSpace = async (req, res, next) => {
    try {
        const getWorkingSpace = await WorkingSpace.find({isDeleted: false});
        response(req, res, activity, 'Level-2', 'Get-WorkingSpace', true, 200, getWorkingSpace, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-WorkingSpace', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Haripriyan K
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete single User.
 */
export let getSingleWorkingSpace = async (req, res, next) => {
    try {
        const getSingleWorkingSpace = await WorkingSpace.findOne({ _id: req.query._id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-SingleWorkingSpace', true, 200, getSingleWorkingSpace, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleWorkingSpace', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Haripriyan K
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete single User.
 */
export let updateWorkingSpace = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const updateWorkingSpace: WorkingSpaceDocument = req.body;
            const updateData = await WorkingSpace.findOne({ _id: req.body._id },{ new: true });
            if(updateData){
                const updateValue=new WorkingSpace(updateWorkingSpace);
                let update=await updateValue.updateOne({
                    $set: {
                        title:updateWorkingSpace.title,
                        introduction:updateWorkingSpace.introduction,
                        facilities:updateWorkingSpace.facilities,
                        waysOfWorking:updateWorkingSpace.waysOfWorking,
                        status:updateWorkingSpace.status,
                        modifiedOn:updateWorkingSpace.modifiedOn,
                        modifiedBy:updateWorkingSpace.modifiedBy
                 }
            })
            response(req, res, activity, 'Level-2', 'Update-WorkingSpace', true, 200, update, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-WorkingSpace', false, 500, {}, errorMessage.internalServer, "Data not found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-WorkingSpace', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-WorkingSpace', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
/**
 * @author Haripriyan K
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete single User.
 */
export let deleteWorkingSpace = async (req, res, next) => {
    try {
        const deleteWorkingSpace = await WorkingSpace.findOneAndUpdate({ _id: req.query._id },{
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        }, { new: true });
        response(req, res, activity, 'Level-2', 'Delete-WorkingSpace', true, 200, deleteWorkingSpace, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-WorkingSpace', false, 500, {}, errorMessage.internalServer, err.message);
    }
};