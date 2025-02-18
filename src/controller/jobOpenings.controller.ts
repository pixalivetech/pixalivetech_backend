import {JobOpeningsDocument,Jobopenings } from "../model/jobOpenings.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "Openings";
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let saveOpenings = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createOpenings: JobOpeningsDocument = req.body;
            const createData = new Jobopenings(createOpenings);
            const insertData = await createData.save();
            response( req,res,activity,"Level-2","Save-Openings",true,200,insertData,clientError.success.savedSuccessfully );
        } catch (err: any) {
            response( req,res,activity,"Level-3","Save-Openings",false,500,{},errorMessage.internalServer,err.message );
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Openings', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let getOpenings = async (req, res, next) => {
    try {
        const getOpenings = await Jobopenings.find({isDeleted: false});
        response(req, res, activity, 'Level-2', 'Get-Openings', true, 200, getOpenings, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Openings', false, 500, {}, errorMessage.internalServer, err.message);
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
export let getSingleOpenings = async (req, res, next) => {
    try {
        const getSingleOpenings = await Jobopenings.findOne({ _id: req.query._id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-SingleOpenings', true, 200, getSingleOpenings, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleOpenings', false, 500, {}, errorMessage.internalServer, err.message);
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
export let updateOpenings = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const updateOpenings: JobOpeningsDocument = req.body;
            const updateData = await Jobopenings.findOne({ _id: req.body._id },{ new: true });
            if(updateData){
                const updateValue=new Jobopenings(updateOpenings);
                let update=await updateValue.updateOne({
                    $set: {
                        title: updateOpenings.title,
                        description: updateOpenings.description,
                        qualifications: updateOpenings.qualifications,
                        extraQualifications:updateOpenings.extraQualifications,
                        email:updateOpenings.email,
                        vacancies:updateOpenings.vacancies,
                        status:updateOpenings.status,
                        modifiedOn:updateOpenings.modifiedOn,
                        modifiedBy:updateOpenings.modifiedBy
                 }
            })
            response(req, res, activity, 'Level-2', 'Update-Openings', true, 200, update, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-Openings', false, 500, {}, errorMessage.internalServer, "Data not found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Openings', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Openings', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let deleteOpenings = async (req, res, next) => {
    try {
        const deleteOpenings = await Jobopenings.findOneAndUpdate({ _id: req.query._id },{
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        }, { new: true });
        response(req, res, activity, 'Level-2', 'Delete-Openings', true, 200, deleteOpenings, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Openings', false, 500, {}, errorMessage.internalServer, err.message);
    }
};