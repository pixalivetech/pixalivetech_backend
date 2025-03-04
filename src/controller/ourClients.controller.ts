import { OurClients, OurClientsDocument } from "../model/ourClients.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "OurClients";
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let saveOurClients = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createOurClients: OurClientsDocument = req.body;
            const createData = new OurClients(createOurClients);
            const insertData = await createData.save();
            response( req,res,activity,"Level-2","Save-OurClients",true,200,insertData,clientError.success.savedSuccessfully );
        } catch (err: any) {
            response( req,res,activity,"Level-3","Save-OurClients",false,500,{},errorMessage.internalServer,err.message );
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-OurClients', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let getOurClients = async (req, res, next) => {
    try {
        const getOurClients = await OurClients.find({isDeleted: false});
        response(req, res, activity, 'Level-2', 'Get-OurClients', true, 200, getOurClients, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-OurClients', false, 500, {}, errorMessage.internalServer, err.message);
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
export let getSingleOurClients = async (req, res, next) => {
    try {
        const getSingleOurClients = await OurClients.findOne({ _id: req.query._id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-SingleOurClients', true, 200, getSingleOurClients, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleOurClients', false, 500, {}, errorMessage.internalServer, err.message);
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
export let updateOurClients = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const updateOurClients: OurClientsDocument = req.body;
            const updateData = await OurClients.findOne({ _id: req.body._id },{ new: true });
            if(updateData){
                const updateValue=new OurClients(updateOurClients);
                let update=await updateValue.updateOne({
                    $set: {
                        name:updateOurClients.name,
                        logo:updateOurClients.logo,
                        status:updateOurClients.status,
                        modifiedOn:updateOurClients.modifiedOn,
                        modifiedBy:updateOurClients.modifiedBy
                 }
            })
            response(req, res, activity, 'Level-2', 'Update-OurClients', true, 200, update, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-OurClients', false, 500, {}, errorMessage.internalServer, "Data not found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-OurClients', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-OurClients', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let deleteOurClients = async (req, res, next) => {
    try {
        const deleteOurClients = await OurClients.findOneAndUpdate({ _id: req.query._id },{
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        }, { new: true });
        response(req, res, activity, 'Level-2', 'Delete-OurClients', true, 200, deleteOurClients, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-OurClients', false, 500, {}, errorMessage.internalServer, err.message);
    }
};