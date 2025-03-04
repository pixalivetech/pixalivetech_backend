import { ServicesDocument,Services } from "../model/services.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "Services";
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let saveServices = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createServices: ServicesDocument = req.body;
            const createData = new Services(createServices);
            const insertData = await createData.save();
            response( req,res,activity,"Level-2","Save-Services",true,200,insertData,clientError.success.savedSuccessfully );
        } catch (err: any) {
            response( req,res,activity,"Level-3","Save-Services",false,500,{},errorMessage.internalServer,err.message );
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Services', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let getServices = async (req, res, next) => {
    try {
        const getServices = await Services.find({isDeleted: false});
        response(req, res, activity, 'Level-2', 'Get-Services', true, 200, getServices, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Services', false, 500, {}, errorMessage.internalServer, err.message);
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
export let getSingleServices = async (req, res, next) => {
    try {
        const getSingleServices = await Services.findOne({ _id: req.query._id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-SingleServices', true, 200, getSingleServices, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleServices', false, 500, {}, errorMessage.internalServer, err.message);
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
export let updateServices = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const updateServices: ServicesDocument = req.body;
            const updateData = await Services.findOne({ _id: req.body._id },{ new: true });
            if(updateData){
                const updateValue=new Services(updateServices);
                let update=await updateValue.updateOne({
                    $set: {
                        title:updateServices.title,
                        introduction:updateServices.introduction,
                        expertiseTitle:updateServices.expertiseTitle,
                        expertiseList:updateServices.expertiseList,
                        callToAction:updateServices.callToAction,
                        status:updateServices.status,
                        modifiedOn:updateServices.modifiedOn,
                        modifiedBy:updateServices.modifiedBy
                 }
            })
            response(req, res, activity, 'Level-2', 'Update-Services', true, 200, update, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-Services', false, 500, {}, errorMessage.internalServer, "Data not found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Services', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Services', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let deleteServices = async (req, res, next) => {
    try {
        const deleteServices = await Services.findOneAndUpdate({ _id: req.query._id },{
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        }, { new: true });
        response(req, res, activity, 'Level-2', 'Delete-Services', true, 200, deleteServices, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Services', false, 500, {}, errorMessage.internalServer, err.message);
    }
};