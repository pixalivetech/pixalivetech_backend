import { Video,VideoDocument } from "../model/videoAds.model";
import { response} from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";
import { Users } from "../model/users.model";


var activity="VideoAds";

/**
 * @author Mohanraj V 
 * @date 05-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save the video post on Advertiser
 */


export let saveVideo=async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const videoDetails:VideoDocument=req.body;
            const createData = new Video(videoDetails);
            let insertData= await createData.save();
            response(req,res,activity,'Level-2','Save-VideoAds',true,200,insertData,clientError.success.savedSuccessfully)
        } catch (err:any) {
            response(req,res,activity,'Level-3','Save-VideoAds',false,500,{},errorMessage.internalServer,err.message)
        }
    }
}

/**
 * @author Mohanraj V 
 * @date 05-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all video Ads
 */

export let getAllVideo=async(req,res,next)=>{
    try{
        const data = await Video.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-VideoAds',true,200,data,clientError.success.fetchedSuccessfully)
    }catch(err:any){
        response(req,res,activity,'Level-3','GetAll-VideoAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Mohanraj V 
 * @date 02-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all update Video Ads
 */
export let updateVideoAds=async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
    try{
        const videoDetails:VideoDocument=req.body;
        const updateData = await Video.findByIdAndUpdate({_id:req.body._id},{
            $set:{
                video:videoDetails.video,
                title:videoDetails.title,
                description:videoDetails.description,
                landingPageUrl:videoDetails.landingPageUrl,
                modifiedBy:videoDetails.modifiedBy,
                modifiedOn:videoDetails.modifiedOn

            }});
        response(req,res,activity,'Level-1','Update-VideoAds',true,200,updateData,clientError.success.updateSuccess)
    }catch(err:any){
        response(req,res,activity,'Level-3','Update-VideoAds',false,500,{},errorMessage.internalServer,err.message)
    }
}
    else{
        response(req,res,activity,'Level-3','Update-videoAds',false,500,{},errorMessage.fieldValidation)
    }
}





/**
 * @author Mohanraj V 
 * @date 05-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete the video Ads post
 */

export let deleteVideo = async (req, res, next) => {
    try {
        const deleteData = await Video.findByIdAndUpdate({_id:req.body._id},
            {$set:{isDeleted:true,modifiedBy:req.body.fullName,modifiedOn:new Date()}});
        response(req, res, activity, 'Level-2', 'Delete-VideoAds', true, 200, deleteData, clientError.success.deleteSuccess);
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Delete-VideoAds', false, 500, {}, errorMessage.internalServer, err.message);   
    }
}
/**
 * @author Mohanraj V 
 * @date 05-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get the all ads for advertiser Posted video Ads
 */

export let getAdvertiserPosteVideo = async (req, res, next) => {
    try {
        const data = await Video.find({advertiserId:req.query._id},{likeCount:0,isDeleted:0,status:0,createdBy:0,createdOn:0,modifiedOn:0,modifiedBy:0,likeUser:0,comment:0})
        response(req,res,activity,'Level-1','Get-AdvertiserPostevideoAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req,res,activity,'Level-3','Get-AdvertiserPostevideoAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Santhosh khan K
 * @date 06-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to like video post
 */

export let likeVideo = async (req, res, next) => {
    try {
        const data = await Video.findByIdAndUpdate({_id:req.body._id},{$inc:{likeCount:1},
            $push:{likedUser:req.body.userId}})
        response(req,res,activity,'Level-2','Like-Video',true,200,data,clientError.success.updateSuccess)
    }catch (err:any) {
        response(req,res,activity,'Level-3','Like-Video',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Santhosh khan K
 * @date 06-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to like video post
 */

export let unLikeVideo = async (req, res, next) => {
    try {  
        const value = await Video.findById({_id:req.body._id})
        if(value && value.likeCount>0){
        const data = await Video.findByIdAndUpdate({_id:req.body._id},{$inc:{likeCount:-1},
            $pull:{likedUser:req.body.userId}})
        }
        response(req,res,activity,'Level-2','Unlike-Video',true,200,value,clientError.success.updateSuccess)
    }
    catch (err:any) {
        response(req,res,activity,'Level-3','Unlike-Video',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author MOHANRAJ
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to comment on videoAds
 * */
export let commentVideo = async (req, res, next) => {
    try {
        const userData= await Users.findOne({_id:req.body.userId},{profileUrl:1,userName:1});
        if(userData !== null){
        const data = await Video.findByIdAndUpdate({_id:req.body._id},{$inc:{commentCount:1},
            $push:{comment:{profileUrl:userData.profileUrl,userName:userData.userName,comment:req.body.comment}}}) 
        response(req,res,activity,'Level-2','Comment-Url',true,200,data,clientError.success.updateSuccess);  
        } 
    }catch (error: any) {
        response(req,res,activity,'Level-3','Comment-Url',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author MOHANRAJ
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to comment on videoAds
 * */

export let showVideoComments = async (req, res, next) => {
    try {
        const data = await Video.findOne({_id:req.query._id},{comment:1});
        response(req,res,activity,'Level-2','Show-Comment-Video',true,200,data,clientError.success.updateSuccess); 
}catch (error: any) {
        response(req,res,activity,'Level-3','Show-Comment-Video',false,500,{},errorMessage.internalServer,error.message)      
    }
}

/**
 * @author MOHANRAJ
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete comment on videoAds
 * */

export let deleteCommentVideo = async (req, res, next) => {
    try {
        const data = await Video.findByIdAndUpdate({_id:req.body._id},{$inc:{commentsCount:-1},
            $pull:{comment:{_id:req.body.commentId}}})
        response(req,res,activity,'Level-2','UnComment-Video',true,200,data,clientError.success.updateSuccess);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','UnComment-Video',false,500,{},errorMessage.internalServer,error.message)
        
    }    
}

/**
 * @author MOHANRAJ
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to count on advertiser post video ads
 * */

export let countVideoAds = async (req, res, next) => {
    try {
        const data = await Video.find({advertiserId:req.query.advertiserId}).count();
        response(req,res,activity,'Level-2','Count-VideoAds',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Count-VideoAds',false,500,{},errorMessage.internalServer,error.message)
        
    }
}

/**
 * @author MOHANRAJ
 * @date 11-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single video ads
 * */

export let getSingleVideoAds = async (req, res, next) => {
    try {
        const data = await Video.findById({_id:req.query._id});
        response(req,res,activity,'Level-2','Get-SingleVideoAds',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Get-SingleVideoAds',false,500,{},errorMessage.internalServer,error.message)
        
    }
}