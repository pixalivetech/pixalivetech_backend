import { Url,UrlDocument } from "../model/url.model";
import { Users} from "../model/users.model";
import { Advertiser } from "../model/advertiser.model";
import { response ,generate} from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";   
import { validationResult } from "express-validator";
import {  } from "../model/url.model"
import { sendNotificationSingle } from "../controller/notification.controller";
import mongoose from "mongoose";


var activity="Url";
var mobileNumber = 9988776655;

/**
 * @author Mohanraj V 
 * @date 25-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save url
 * */
export let saveUrl = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const userUrl= await Url.findOne({ $and: [{ advertiserId: { $eq:req.body.advertiserId } }, { url:req.body.url }, { isDeleted: false }] });
            const userData=await Advertiser.findOne({_id:req.body.advertiserId},{name:1,profileUrl:1});
            if(userData !== null){
            if(userUrl){
                response(req, res, activity, 'Level-2', 'Save-Url', true, 422, {}, 'Url already exists');
            } else {
                const urlData: UrlDocument = req.body;
                //add profile and username to adda url
                const advertiserCoin = await Advertiser.findById({_id:req.body.advertiserId},{coinValue:1})
                if ((advertiserCoin?.coinValue !== 0) && ( urlData?.coinValue !== 0)) {
                        urlData.userName=userData.name;
                        urlData.profileUrl=userData?.profileUrl;
                        const createUrl = new Url(urlData);
                        let insertUrl = await createUrl.save();
                    if(insertUrl?.coinValue){
                        const data = await Advertiser.findByIdAndUpdate({_id:req.body.advertiserId},
                            {$inc:{coinValue:-insertUrl.coinValue,
                                    postCount:1
                            }});
                }
                response(req, res, activity, 'Level-2', 'Save-Url', true, 200, insertUrl, clientError.success.savedSuccessfully);
            }else{
                response(req, res, activity, 'Level-2', 'Save-Url', true, 422, {}, 'Insufficient Coin On Advertiser Profile');
            }
        }
            }
    } catch (err: any) {
            response(req, res, activity, 'Save-Url', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Save-Url', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Mohanraj V 
 * @date 29-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all url details
 * */
export let getAllUrl = async (req, res, next) => {
        try{
                const user= await Users.findOne({_id:req.query._id},{blockedUsers:1,_id:0});
        
        const urlData = await Url.find({$and:[{isDeleted:false},{advertiserId:{$nin:user?.blockedUsers}},{coin:false}]}).populate('advertiserId',{name:1,profileUrl:1})
        console.log(urlData);
        
        response(req, res, activity, 'Level-2', 'Get-Url', true, 200, urlData, clientError.success.fetchedSuccessfully);
        }
     catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Url', false, 500, {}, errorMessage.internalServer, err.message);
    }   
    
};

/**
 * @author Mohanraj V 
 * @date 29-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update url details
 * */
export let updateUrl = async (req, res, next) => {
    try {
        const urlData: UrlDocument = req.body;
        const updateUrl = await Url.findOneAndUpdate({ _id: urlData._id },{
            $set: {
                url: urlData.url,
                description: urlData.description,
                category: urlData.category,
                likeCount: urlData.likeCount,
                isDeleted: urlData.isDeleted,
                status: urlData.status
            }
        });
        response(req, res, activity, 'Level-2', 'Update-Url', true, 200, updateUrl, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-Url', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh khan K
 * @date 29-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete url details
 * */
export let deletedUrl = async (req, res, next) => {
    try {
        let id = req.body._id;
        let {modifiedBy,modifiedOn} = req.body;
        console.log(modifiedBy,modifiedOn);
        
        const data = await Url.findByIdAndUpdate({_id:id},
            {$set:{isDeleted:true,
             modifiedBy:modifiedBy,
             modifiedOn:modifiedOn    }});
        const userData=await Advertiser.findByIdAndUpdate({_id:req.body.advertiserId},{$inc:{postCount:-1}});     
        response(req, res, activity, 'Level-2', 'Delete-Url', true, 200, data, clientError.success.deleteSuccess);
    } catch (error: any) {
        response(req, res, activity, 'Level-3', 'Delete-Url', false, 500, {}, errorMessage.internalServer, error.message);
    }
}

/**
 * @author Mohanraj V
 * @date 06-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to like url
 * */
export let likeUrl = async (req, res, next) => {
    try {
        const data = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{likeCount:1},
            $push:{likedUser:req.body.userId}});
            if(data?.likeAmount !=0){
                const data2 = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:0.5}})
                const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{likeAmount:-1}})
                const addCompany = await Users.findOneAndUpdate({mobileNumber:mobileNumber},{$inc:{earnings:0.5}})
            }
            const like = await Users.findById({_id:req.body.userId},{fullName:1,_id:0})
            const value1 = data?.advertiserId?.toString(); // Convert ObjectId to string
            const value2 = await Advertiser.findById({_id:value1},{fcm_Token:1,_id:0})
            const fcm_Token = value2?.fcm_Token;
            const Title="Like Notification";
                const Description = like?.fullName;
                const Data = like?.fullName+" Liked Your Post";
                sendNotificationSingle(fcm_Token,Title,Description,Data)  
            response(req,res,activity,'Level-2','Like-Url',true,200,data,clientError.success.updateSuccess)
    } catch (err:any) {
        response(req,res,activity,'Level-3','Like-Url',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Mohanraj V
 * @date 06-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete liked url
 * */
export let unLikeUrl = async (req, res, next) => {
    try {
        const value = await Url.findById({_id:req.body._id})
        if(value && value.likeCount>0){
        const data = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{likeCount:-1},
            $pull:{likedUser:req.body.userId}});
            if(data){
                const data2 = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:-0.5}})
                const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{likeAmount:1}})
                const addCompany = await Users.findOneAndUpdate({mobileNumber:mobileNumber},{$inc:{earnings:-0.5}})
            }
        }
        response(req,res,activity,'Level-2','Unlike-Url',true,200,value,clientError.success.updateSuccess)
    }
    catch (err:any) {
        response(req,res,activity,'Level-3','Unlike-Url',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Mohanraj V
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to comment url
 * */
export let commentUrl = async (req, res, next) => {
    try {
        const userData= await Users.findOne({_id:req.body.userId},{profileUrl:1,userName:1,fullName:1});
        if(userData !== null){
        const data = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{commentsCount:1},
            $push:{comment:{profileUrl:userData.profileUrl,userName:userData.userName,comment:req.body.comment}}})
            const value1 = data?.advertiserId?.toString(); // Convert ObjectId to string
            const value2= await Users.findById({_id:value1},{fcm_Token:1,_id:0})
            const fcm_Token=value2?.fcm_Token;
            const Title="Comment Notification";
                const Description="";
               const Data=userData?.fullName+" Commented Your Post";
                sendNotificationSingle(fcm_Token,Title,Description,Data)
        response(req,res,activity,'Level-2','Comment-Url',true,200,data,clientError.success.updateSuccess);   
        } 
    }catch (error: any) {
        response(req,res,activity,'Level-3','Comment-Url',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Mohanraj V
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to comment on videoAds
 * */
export let showUrlComments = async (req, res, next) => {
    try {
        const data = await Url.findOne({_id:req.query._id},{comment:1});
        response(req,res,activity,'Level-2','Show-Comment-Url',true,200,data,clientError.success.updateSuccess); 
    }catch (error: any) {
        response(req,res,activity,'Level-3','Show-Comment-Url',false,500,{},errorMessage.internalServer,error.message)    
    }
}

/**
 * @author Mohanraj V
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete comment url
 * */
export let deleteCommentUrl = async (req, res, next) => {
    try {
        const data = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{commentsCount:-1},
            $pull:{comment:{_id:req.body.commentId}}})
        response(req,res,activity,'Level-2','UnComment-Url',true,200,data,clientError.success.updateSuccess);     
    } catch (error: any) {
        response(req,res,activity,'Level-3','UnComment-Url',false,500,{},errorMessage.internalServer,error.message)
    }    
}

/**
 * @author Mohanraj V
 * @author Praveenkumar K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get trending url 
 * */
export let getTrendingUrl = async (req, res, next) => {
    try {
        const data = await Url.aggregate([
            { $match:{$and:[{ isDeleted: false },{coin:false}]} },
            { $group: { _id: { url: "$url"},count: { $sum: 1 }} },
            { $sort: { count: -1 } },
            {$project:{url:"$_id.url",count:"$count",category:"$_id.category",userId:"$_id.userId",urlId:"$_id.urlId",profileUrl:"$_id.profileUrl"}},
            { $limit: 20 } 
        ])
        //,category: "$category",userId: "$user_Id",urlId: "$_id",profileUrl: "$profileUrl" 
        response(req,res,activity,'Level-2','Get-Trending-Url',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Get-Trending-Url',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @author Praveenkumar K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get trending url category vice.
 */
export let getTrendingCategory = async (req, res, next) => {
    try {
        //const data = await Url.find({category:req.query.category})
        const data = await Url.aggregate([
            { $match: {$and:[{ isDeleted: false },{category:req.query.category},{coin:false}]}},
            { $group: { _id: { url: "$url"},count: { $sum: 1 }} },
            { $sort: { count: -1 } },
            {$project:{url:"$_id.url",count:"$count"}},
            { $limit: 20 }     
        ])
        response(req,res,activity,'Level-1','Get-Trending-Category',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-Trending-Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @author Praveenkumar K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to view Url post by using category.
 */
export let category = async (req, res, next) => {
    try {

        const data = await Url.find({$and:[{category:req.query.category},{isDeleted:false},{coin:false}]}).populate('advertiserId',{name:1,profileUrl:1})
        response(req,res,activity,'Level-1','Get-Category',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get url count
 */
export let urlCount = async (req, res, next) => {
    try {
        const data = await Url.countDocuments({$and:[{isDeleted:false},{coin:false}]})
        response(req,res,activity,'Level-1','Get-Url-Count',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-Url-Count', false, 500, {}, errorMessage.internalServer, err.message);   
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to report url
 */
export let reporturl = async (req, res, next) => {  
    try {
        const urlData = await Url.findByIdAndUpdate({_id:req.body._id}, {
            $push:{reports:{reason:req.body.reason,createOn:new Date()}},$inc:{reportCount:1}});
            if(urlData) {
                const reportCount = await Url.findOne({_id:req.body._id},{reportCount:1});
                if(reportCount !== null){
                if(reportCount.reportCount>10) {
                    const value = await Url.findByIdAndUpdate({_id:req.body._id}, {$set:{isDeleted:true,status:2}});
                }}
                response(req, res, activity,'Level-2','Report-Url', true, 200, urlData, clientError.success.updateSuccess); 
            } 
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Report-Url', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to show reported url in admin
 */
export let showReportedUrl = async (req, res, next) => {
    try {
        const data = await Url.find({$and:[{isDeleted:true},{status:2}]})
        response(req,res,activity,'Level-1','Show-Reported-Url',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Show-Reported-Url', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get url posted by user
 */
export let getPostedUrl = async (req, res, next) => {
    try {
        const data = await Url.find({url:req.query.url},{_id:0,url:1}).populate('userId',{fullName:1,profileUrl:1,userName:1,_id:1})   
        response(req,res,activity,'Level-1','Get-Posted-Url',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-Posted-Url', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @author Praveenkumar K
 * @author Mohanraj v
 * @date 17-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to count url clicks
 */
export let urlClickCount = async (req, res, next) => {
    try {
            const data = await Users.findById({_id:req.body.userId},{gender:1,country:1})
    if(data == null) {
            response(req, res, activity, 'Level-3', 'Url-Click-Count', false, 500, {}, errorMessage.internalServer, 'User Not Found');
        } 
    else{
        if(data.gender == 1 && data.country == 1) {
            const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickCount:1,maleGender:1,indianUsers:1}})
            if(data1?.clickAmount !=0){
                const data2 = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:2.5,}})
                const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickAmount:-5}})
                const addCompany = await Users.findOneAndUpdate({mobileNumber:mobileNumber},{$inc:{earnings:2.5}})
            }
            response(req,res,activity,'Level-2','Get-ClickCount',true,200,data1,clientError.success.updateSuccess);
        }
        else if(data.gender == 1 && data.country == 2) {
            const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickCount:1,maleGender:1,otherUsers:1}})
            if(data1?.clickAmount !=0){
                const data2 = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:2.5}})
                const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickAmount:-5}})
                const addCompany = await Users.findOneAndUpdate({mobileNumber:mobileNumber},{$inc:{earnings:2.5}})
            }
            response(req,res,activity,'Level-2','Get-ClickCount',true,200,data1,clientError.success.updateSuccess);
        }
        else if(data.gender == 2 && data.country == 1) {
            const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickCount:1,femaleGender:1,indianUsers:1,}})
            if(data1?.clickAmount !=0){
                const data2 = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:2.5}})
                const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickAmount:-5}})
                const addCompany = await Users.findOneAndUpdate({mobileNumber:mobileNumber},{$inc:{earnings:2.5}})
            }
            response(req,res,activity,'Level-2','Get-ClickCount',true,200,data1,clientError.success.updateSuccess);
        }
        else if(data.gender == 2 && data.country == 2) {
            const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickCount:1,femaleGender:1,otherUsers:1}})
            if(data1?.clickAmount !=0){
                const data2 = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:2.5}})
                const data1 = await Url.findByIdAndUpdate({_id:req.body._id},{$inc:{clickAmount:-5}})
                const addCompany = await Users.findOneAndUpdate({mobileNumber:mobileNumber},{$inc:{earnings:2.5}})
            }
            response(req,res,activity,'Level-2','Get-ClickCount',true,200,data1,clientError.success.updateSuccess);
        } 

        const value = await Url.findById({_id:req.body._id})
        if(value?.likeAmount == 0 && value?.clickAmount == 0 )
        {
            const data = await Url.findByIdAndUpdate({_id:req.body._id},
                {$set:{
                    isDeleted:true,
                    coin:true,
                    coinValue:0
                }})
        }
    }
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-ClickCount', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Haripriyan K
 * @author Praveenkumar K
 * @date 17-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to count url clicks
 */
export let userViewCount = async (req, res, next) => {
    try {
        const data = await Users.findByIdAndUpdate({_id:req.query._id},{$inc:{viewCount:1}})
        const data1 = await Users.find({_id:req.query._id},{viewCount:1,_id:0})
        const data2 = data1.reduce((a:any,b:any)=>a+b.viewCount,0)
        response(req,res,activity,'Level-2','Get-ClickCount',true,200,data2,clientError.success.updateSuccess);
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-ClickCount', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan
 * @author Praveenkumar k
 * @date 18-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to count over all likes of the user
 */
export let userLikeCount = async (req, res, next) => {
    try {
        const data = await Url.find({userId:req.query._id},{likeCount:1,_id:0})
        const data1 = data.reduce((a:any,b:any)=>a+b.likeCount,0)
        const userData = await Users.findByIdAndUpdate({_id:req.query._id},{$set:{allLikesCount:data1}})
        response(req,res,activity,'Level-2','Get-UserLikeCount',true,200,data1,clientError.success.updateSuccess);
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-UserLikeCount', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

 /** 
 * @author Balaji Murahari
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to show the clicked count of the URL.
 */
export let searchUrl = async (req,res,next)=>{
    try {
        const data = await Url.find({$or:[{url:{$regex:req.body.word,$options:'i'}}]})
        response(req,res,activity,'Level-1','Search-Url',true,200,data,clientError.success.fetchedSuccessfully)
    } catch(err:any) {
        response(req,res,activity,'Level-3','Search-Url',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Balaji Murahari
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to view category count
 */
export let categoryCount = async (req, res, next) => {
    try {
        const data = await Url.countDocuments({category:req.query.category});   
        response(req,res,activity,'Level-1','Category-Count',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Category-Count', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single user posted url
 */
export let getSingleUserPostedUrl = async (req, res, next) => {
    try {
        const data = await Url.find({ $and: [{advertiserId: req.query.advertiserId} , {isDeleted:false}] })
        response(req,res,activity,'Level-1','Get-SingleAdvertiserDetails',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-SinglAdvertiserDetails', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan
 * @date 23-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all liked users
 */
export let getAllLikedUsers = async (req, res, next) => {
    try {
        const likedUser = await Url.findById({_id:req.query._id},{likedUser:1,_id:0})
        response(req,res,activity,'Level-1','Get-AllLikedUsers',true,200,likedUser,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-AllLikedUsers', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V
 * @date 30-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get trending url in clickCount Based
 */

export let getUrlClickCountBased = async (req, res, next) => {
    try {      
        const data = await Url.find({isDeleted:false},{url:1,description:1,clickCount:1,category:1}).sort({clickCount:-1}).limit(5).populate('advertiserId',{name:1,profileUrl:1})
        response(req,res,activity,'Level-1','Get-UrlClickCountBased',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-UrlClickCountBased', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**{}
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get advertiser based details get to urls.
 */
export let advertiserPostDetails = async (req, res, next) => {
    try {      
            const advertiserId =  new mongoose.Types.ObjectId( req.query.advertiserId);
            
        const aggregationPipeline = [
            {
              $match: { advertiserId:advertiserId }
            },
            {
              $group: {
                _id:'$advertiserId',      
                 totalClickCount: { $sum: '$clickCount' },
                totalIndianUsers: { $sum: '$indianUsers' },
                totalOtherUsers: { $sum: '$otherUsers' },
                totalMaleCount: { $sum: '$maleGender' },
                totalFemaleCount: { $sum: '$femaleGender' },
                totalLikeCount: { $sum: '$likeCount' },
                totalCommentsCount: { $sum: '$commentsCount' },
              },
            },
          ];
          // Run the aggregation pipeline
             const urlData = await Url.aggregate(aggregationPipeline)
             console.log(urlData);
             
             response(req,res,activity,'Level-1','Get-UrlClickCountBased',true,200,urlData,clientError.success.fetchedSuccessfully)

        
    } catch (err:any) {
        response(req,res,activity,'Level-3','AdvertiserPostDetails',false,500,{},errorMessage.internalServer,err.message)
        
    }
}

/**
 * @author Mohanraj V
 * @date 10-01-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get the like count on user liked
 * */

export let userGetLikeCount = async (req, res, next) => {
    try {
        const data = await Url.find({ $and: [{likedUser: req.query._id},{isDeleted:false}] }).count()
        response(req,res,activity,'Level-1','Get-SingleAdvertiserDetails',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-SinglAdvertiserDetails', false, 500, {}, errorMessage.internalServer, err.message);
    }
}