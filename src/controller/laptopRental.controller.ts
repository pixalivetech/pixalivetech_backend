import { LaptopRental, LaptopRentalDocument } from "../model/laptopRental.model";
import { response } from "../helper/commonResponseHandler";
import { errorMessage, clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";

var activity = "LaptopRental";
/**
 * @author BalajiMurhari
 * @date   08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update product.
 */
export let saveLaptopRental = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createLaptopRental: LaptopRentalDocument = req.body;
            const createData = new LaptopRental(createLaptopRental);
            const insertData = await createData.save();
            response( req,res,activity,"Level-2","Save-LaptopRental",true,200,insertData,clientError.success.savedSuccessfully );
        } catch (err: any) {
            response( req,res,activity,"Level-3","Save-LaptopRental",false,500,{},errorMessage.internalServer,err.message );
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-LaptopRental', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let getLaptopRental = async (req, res, next) => {
    try {
        const getLaptopRental = await LaptopRental.find({isDeleted: false});
        response(req, res, activity, 'Level-2', 'Get-LaptopRental', true, 200, getLaptopRental, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-LaptopRental', false, 500, {}, errorMessage.internalServer, err.message);
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
export let getSingleLaptopRental = async (req, res, next) => {
    try {
        const getSingleLaptopRental = await LaptopRental.findOne({ _id: req.query._id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-SingleLaptopRental', true, 200, getSingleLaptopRental, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleLaptopRental', false, 500, {}, errorMessage.internalServer, err.message);
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
export let updateLaptopRental = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const updateLaptopRental: LaptopRentalDocument = req.body;
            const updateData = await LaptopRental.findOne({ _id: req.body._id },{ new: true });
            if(updateData){
                const updateValue=new LaptopRental(updateLaptopRental);
                let update=await updateValue.updateOne({
                    $set: {
                        title:updateLaptopRental.title,
                        desc:updateLaptopRental.desc,
                        price:updateLaptopRental.price,
                        img:updateLaptopRental.img,
                        status:updateLaptopRental.status,
                        modifiedOn:updateLaptopRental.modifiedOn,
                        modifiedBy:updateLaptopRental.modifiedBy
                 }
            })
            response(req, res, activity, 'Level-2', 'Update-LaptopRental', true, 200, update, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-LaptopRental', false, 500, {}, errorMessage.internalServer, "Data not found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-LaptopRental', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-LaptopRental', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
export let deleteLaptopRental = async (req, res, next) => {
    try {
        const deleteLaptopRental = await LaptopRental.findOneAndUpdate({ _id: req.query._id },{
            $set: {
                isDeleted: true,
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy
            }
        }, { new: true });
        response(req, res, activity, 'Level-2', 'Delete-LaptopRental', true, 200, deleteLaptopRental, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-LaptopRental', false, 500, {}, errorMessage.internalServer, err.message);
    }
};