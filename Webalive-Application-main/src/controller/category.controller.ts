import { validationResult } from "express-validator";
import { clientError,errorMessage } from "../helper/ErrorMessage";
import { response} from "../helper/commonResponseHandler";
import { Category,CategoryDocument } from "../model/category.model";

var activity = "Category";

/**
 * @author Haripriyan K
 * @date 12-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is use to Create Category
 */
export let saveCategory = async (req,res)=>{
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const createCategory:CategoryDocument = req.body
            const createData = new Category(createCategory)    
            const insertData = await createData.save()
            response(req, res, activity,'Level-2','Save-Category', true, 200, insertData, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity,'Level-3','Save-Category', false, 500, {}, errorMessage.internalServer, err.message)
        }
    }
    else {
        response(req, res, activity, 'Save-Category', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    } 
}

/**
 * @author Haripriyan K
 * @date 13-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is use to get Category
 */
export let getAllCategory = async (req, res, next) => {
    try {
        const showData = await Category.find({isDeleted:false})
        response(req, res, activity,'Level-1','GetAll-Category', true, 200, showData, clientError.success.fetchedSuccessfully)
    } catch (err:any){
        response(req, res, activity,'Level-3','GetAll-Category', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
 * @author Haripriyan K
 * @date 13-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Category.
 */
export let updateCategory = async (req, res, next) => {
    try{
        const categoryData : CategoryDocument = req.body
        const updateCategory = await Category.updateMany({
            $set:{
                category:categoryData.category,
                categoryImage:categoryData.categoryImage
            }
        })
        response(req, res, activity,'Level-1','Update-PrivacyPolicy', true, 200, updateCategory, clientError.success.updateSuccess)
    } catch (err:any){
        response(req, res, activity,'Level-3','Update-PrivacyPolicy', false, 500, {}, errorMessage.internalServer, err.message)
    }
}