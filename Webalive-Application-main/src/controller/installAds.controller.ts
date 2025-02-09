import { validationResult } from "express-validator";
import { response } from "../helper/commonResponseHandler";
import { clientError,errorMessage } from "../helper/ErrorMessage";
import { InstallAds,InstallAdsDocument } from "../model/installAds.model";

var activity ="InstallAds"

/**
 * @author Mohanraj V
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save the ads for advertiser panal
 */

export let saveInstallAds =async (req,res,next)=>{
    const errors=validationResult(req);
    if (errors.isEmpty()) {
        try {
            const adsDetails:InstallAdsDocument=req.body; 
            const createData = new InstallAds(adsDetails);
            let insertData= await createData.save();
            response(req,res,activity,'Level-2','Save-InatallAds',true,200,insertData,clientError.success.savedSuccessfully)
        } catch (err:any) {
            response(req,res,activity,'Level-3','Save-InstallAds',false,500,{},errorMessage.internalServer,err.message)
        }
    } else {
        response(req,res.activity,'Level-3','Save-InstallAds',false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()))
    }
}

/**
 * @author Mohanraj V
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to show all InstallAds 
 */
 
export let getAllInstallAds=async (req,res,next)=>{
    try{
        const data = await InstallAds.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-InstallAds',true,200,data,clientError.success.fetchedSuccessfully)
    }catch(err:any){
        response(req,res,activity,'Level-3','GetAll-InstallAds',false,500,{},errorMessage.internalServer,err.message)
    }
}
/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all update install  Ads
 */
export let updateInstallAds=async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
    try{
        const installDetails:InstallAdsDocument=req.body;
        const updateData = await InstallAds.findByIdAndUpdate({_id:req.body._id},{
            $set:{
                image:installDetails.image,
                title:installDetails.title,
                description:installDetails.description,
                modifiedBy:installDetails.modifiedBy,
                modifiedOn:installDetails.modifiedOn

            }});
        response(req,res,activity,'Level-1','Update-InstallAds',true,200,updateData,clientError.success.updateSuccess)
    }catch(err:any){
        response(req,res,activity,'Level-3','Update-InstallAds',false,500,{},errorMessage.internalServer,err.message)
    }
}
    else{
        response(req,res,activity,'Level-3','Update-InstallAds',false,500,{},errorMessage.fieldValidation)
    }
}
/**
 * @author Mohanraj V
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Delete the InstallAds Post
 */

export let deleteInstallAds = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id; //send adPost Id
        const deleteData = await InstallAds.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-InstallAds', true, 200, deleteData, clientError.success.deleteSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-InstallAds', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
/**
 * @author Mohanraj V
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get the all ads for advertiser Posted Ads
 */

export let getAdvertiserPosteAds = async (req, res, next) => {
    try {
        let id = req.query._id; //send advertiser Id
        const data = await InstallAds.find({ advertiserId: id },{likeCount:0,isDeleted:0,status:0,createdBy:0,createdOn:0,modifiedOn:0,modifiedBy:0,likeUser:0,comment:0})
        response(req, res, activity, 'Level-2', 'Get-SingleResource', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleResource', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get the Single ads for advertiser Posted Ads
 */
export let getSingleInstallAds = async (req, res, next) => {
    try {
        const data = await InstallAds.findById({_id:req.query._id})
        response(req,res,activity,'Level-1','Get-SingleInstallAds',true,200,data,clientError.success.fetchedSuccessfully)
    }
    catch(err:any){
        response(req,res,activity,'Level-3','Get-SingleInstallAds',false,500,{},errorMessage.internalServer,err.message)
    }
}
/**
 * @author Mohanraj V
 * @date 06-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Search InstallAds
 */

export let searchInstallAds = async (req, res, next) => {
    try {
        const data = await InstallAds.find({$or:[{advertiserName:{$regex:req.body.word,$options:'i'}},{description:{$regex:req.body.word,$options:'i'}},{steps:{$regex:req.body.word,$options:'i'}}]})
        response(req,res,activity,'Level-1','Search-InstallAds',true,200,data,clientError.success.fetchedSuccessfully)
}catch(err:any){
    response(req,res,activity,'Level-3','Search-InstallAds',false,500,{},errorMessage.internalServer,err.message)
}
}

/**
 * @author MOHANRAJ
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to count on advertiser post install  ads
 * */

export let countInstallAds = async (req, res, next) => {
    try {
        const data = await InstallAds.find({$and: [{advertiserId:req.query.advertiserId},{isDeleted:false}] }).count();
        response(req,res,activity,'Level-2','Count-InstallAds',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Count-InstallAds',false,500,{},errorMessage.internalServer,error.message)
        
    }
}