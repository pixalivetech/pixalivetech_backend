import {HireDevelopersDocument  ,HireDevelopers} from "../model/hireDevelopers.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "Developers";
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let saveDevelopers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createDevelopers: HireDevelopersDocument = req.body;
            const createData = new HireDevelopers(createDevelopers);
            const insertData = await createData.save();
            response( req,res,activity,"Level-2","Save-Developers",true,200,insertData,clientError.success.savedSuccessfully );
        } catch (err: any) {
            response( req,res,activity,"Level-3","Save-Developers",false,500,{},errorMessage.internalServer,err.message );
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Developers', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let getDevelopers = async (req, res, next) => {
    try {
        const getDevelopers = await HireDevelopers.find({isDeleted: false});
        response(req, res, activity, 'Level-2', 'Get-Developers', true, 200, getDevelopers, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Developers', false, 500, {}, errorMessage.internalServer, err.message);
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
export let getSingleDevelopers = async (req, res, next) => {
    try {
        const getSingleDevelopers = await HireDevelopers.findOne({ _id: req.query._id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-SingleDevelopers', true, 200, getSingleDevelopers, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleDevelopers', false, 500, {}, errorMessage.internalServer, err.message);
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
export let updateDevelopers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const updateDevelopers: HireDevelopersDocument = req.body;
            const updateData = await HireDevelopers.findOne({ _id: req.body._id },{ new: true });
            if(updateData){
                const updateValue=new HireDevelopers(updateDevelopers);
                let update=await updateValue.updateOne({
                    $set: {
                        role: updateDevelopers.role,
                        title: updateDevelopers.title,
                        introduction: updateDevelopers.introduction,
                        highlights: updateDevelopers.highlights,
                        services:updateDevelopers.services,
                        whyUs:updateDevelopers.whyUs,
                        hiringModels: updateDevelopers.hiringModels,
                        status:updateDevelopers.status,
                        modifiedOn:updateDevelopers.modifiedOn,
                        modifiedBy:updateDevelopers.modifiedBy
                 }
            })
            response(req, res, activity, 'Level-2', 'Update-Developers', true, 200, update, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-Developers', false, 500, {}, errorMessage.internalServer, "Data not found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Developers', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Developers', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let deleteDevelopers = async (req, res, next) => {
    try {
        const deleteDevelopers = await HireDevelopers.findOneAndUpdate({ _id: req.query._id },{
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        }, { new: true });
        response(req, res, activity, 'Level-2', 'Delete-Developers', true, 200, deleteDevelopers, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Developers', false, 500, {}, errorMessage.internalServer, err.message);
    }
};