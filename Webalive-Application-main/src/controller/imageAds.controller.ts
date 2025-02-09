import { Image,ImageDocument } from "../model/imageAds.model";
import { Users } from "../model/users.model";
import { response} from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";
import {  } from "../utils/tokenManager";

var activity="ImageAds";

/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save the image post on Advertiser
 */


export let saveImage=async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const imageDetails:ImageDocument=req.body;
            const createData = new Image(imageDetails);
            let insertData= await createData.save();
            console.log("hello");
            response(req,res,activity,'Level-2','Save-ImageAds',true,200,insertData,clientError.success.savedSuccessfully)
        } catch (err:any) {
            response(req,res,activity,'Level-3','Save-ImageAds',false,500,{},errorMessage.internalServer,err.message)
        }
    }
}

/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Image Ads
 */

export let getAllImage=async(req,res,next)=>{
    try{
        const data = await Image.find({isDeleted:false},{title:1,image:1,description:1,allocatedAmount:1,amountPerView:1,status:1});
        response(req,res,activity,'Level-1','GetAll-ImageAds',true,200,data,clientError.success.fetchedSuccessfully)
    }catch(err:any){
        response(req,res,activity,'Level-3','GetAll-ImageAds',false,500,{},errorMessage.internalServer,err.message)
    }
}
/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all update Image Ads
 */
export let updateImageAds=async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
    try{
        const imageDetails:ImageDocument=req.body;
        const updateData = await Image.findByIdAndUpdate({_id:req.body._id},{
            $set:{
                image:imageDetails.image,
                title:imageDetails.title,
                description:imageDetails.description,
                landingPageUrl:imageDetails.landingPageUrl,
                modifiedBy:imageDetails.modifiedBy,
                modifiedOn:imageDetails.modifiedOn

            }});
        response(req,res,activity,'Level-1','Update-ImageAds',true,200,updateData,clientError.success.updateSuccess)
    }catch(err:any){
        response(req,res,activity,'Level-3','Update-ImageAds',false,500,{},errorMessage.internalServer,err.message)
    }
}
    else{
        response(req,res,activity,'Level-3','Update-ImageAds',false,500,{},errorMessage.fieldValidation)
    }
}

/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete the Image Ads post
 */

export let deleteImage = async (req, res, next) => {
    
    try {
        let id = req.query._id;
        let {modifiedBy,modifiedOn} = req.body;
        const deleteData = await Image.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-ImageAds', true, 200, deleteData, clientError.success.deleteSuccess);
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Delete-ImageAds', false, 500, {}, errorMessage.internalServer, err.message);   
    }
}
/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get the all ads for advertiser Posted Image Ads
 */

export let getAdvertiserPosteImage = async (req, res, next) => {
    try {
        const data = await Image.find({advertiserId:req.query._id},{likeCount:0,isDeleted:0,status:0,createdBy:0,createdOn:0,modifiedOn:0,modifiedBy:0,likeUser:0,comment:0});
        response(req,res,activity,'Level-1','Get-advertiserPosteImageAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req,res,activity,'Level-3','Get-advertiserPosteImageAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Santosh Khan K
 * @date 06-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to like the Image
 */
export let likeImage = async (req, res, next) => {
    try {
        const data = await Image.findByIdAndUpdate({_id:req.body._id},{$inc:{likeCount:1},
            $push:{likeUser:req.body.userId}});
        response(req,res,activity,'Level-2','Like-ImageAds',true,200,data,clientError.success.updateSuccess)
    }
    catch (err:any) {
        response(req,res,activity,'Level-3','Like-ImageAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Santosh Khan K
 * @date 06-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to unlike the Image
 */
export let unLikeImage = async (req, res, next) => {
    try {
        const value = await Image.findById({_id:req.body._id})
        if(value && value.likeCount>0){
        const data = await Image.findByIdAndUpdate({_id:req.body._id},{$inc:{likeCount:-1},
            $pull:{likeUser:req.body.userId}})
        }
        response(req,res,activity,'Level-2','Unlike-ImageAds',true,200,value,clientError.success.updateSuccess)
}
    catch (err:any) {
        response(req,res,activity,'Level-3','Unlike-ImageAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author MOHANRAJ
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to comment url
 * */
export let commentImageAds = async (req, res, next) => {
    try {
        const userData= await Users.findOne({_id:req.body.userId},{profileUrl:1,userName:1});
        if(userData !== null){    
        const data = await Image.findByIdAndUpdate({_id:req.body._id},{$inc:{commentCount:1},
            $push:{comment:{profileUrl:userData.profileUrl,userName:userData.userName,comment:req.body.comment}}})
        response(req,res,activity,'Level-2','Comment-Image',true,200,data,clientError.success.updateSuccess);
        } 
    }catch (error: any) {
        response(req,res,activity,'Level-3','Comment-Image',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author MOHANRAJ
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to comment on imageAds
 * */
export let showImageComments = async (req, res, next) => {
    try {
        const data = await Image.findOne({_id:req.query._id},{comment:1});
        response(req,res,activity,'Level-2','Show-Comment-Image',true,200,data,clientError.success.updateSuccess); 
    }catch (error: any) {
        response(req,res,activity,'Level-3','Show-Comment-Image',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author MOHANRAJ
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete comment 
 * */

export let deleteImageCommentsAds = async (req, res, next) => {
    try {
        const data = await Image.updateOne({_id:req.body._id},{$inc:{commentsCount:-1},
            $pull:{comment:{_id:req.body.commentId}}})
        response(req,res,activity,'Level-2','UnComment-Image',true,200,data,clientError.success.updateSuccess);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','UnComment-Image',false,500,{},errorMessage.internalServer,error.message)
        
    }    
}

/**
 * @author MOHANRAJ
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to count on advertiser post image ads
 * */

export let countImageAds = async (req, res, next) => {
    try {
         const data = await Image.find({advertiserId:req.query.advertiserId}).count();
        response(req,res,activity,'Level-2','Count-ImageAds',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Count-ImageAds',false,500,{},errorMessage.internalServer,error.message);
        
    }
}

/**
 * @author MOHANRAJ
 * @date 11-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single image ads
 * */

export let getSingleImageAds = async (req, res, next) => {
    try {
        const data = await Image.findById({_id:req.query._id},{title:1,image:1,description:1,allocatedAmount:1,amountPerView:1,landingPageUrl:1});
        response(req,res,activity,'Level-2','Get-SingleImageAds',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Get-SingleImageAds',false,500,{},errorMessage.internalServer,error.message)
        
    }
}