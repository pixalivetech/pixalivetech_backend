import { validationResult } from "express-validator";
import { ShareAdsDocument,ShareAds } from "../model/shareAds.model";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Users } from "../model/users.model";

var activity = "ShareAds";

/**
 * @author Santhosh khan  
 * @date 30-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save shareAds post
 */

export let saveshareAds = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const shareAdsData: ShareAdsDocument = req.body;
            const createShareAds = new ShareAds(shareAdsData);
            let insertshareAds = await createShareAds.save();
            response(req, res, activity, 'Level-2', 'Save-ShareAds', true, 200, insertshareAds, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Save-ShareAds', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Save-ShareAds', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh khan  
 * @date 30-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all shareAds post
 */

export let getAllShareAds = async (req, res, next) => {
    try {
        const shareAdsData = await ShareAds.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-ShareAds', true, 200, shareAdsData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-ShareAds', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



/**
 * @author Santhosh khan  
 * @date 30-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get single shareAds post
 */

export let getSingleShareAds = async (req, res, next) => {
    try {
        const shareAdsData = await ShareAds.findOne({ _id: req.params.id, isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-ShareAds', true, 200, shareAdsData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-ShareAds', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh khan  
 * @date 30-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete shareAds post
 */

export let deleteShareAds = async (req, res, next) => {
    try {
        const data = await ShareAds.findByIdAndUpdate({_id:req.body._id},
            {$set:{isDeleted:true,modifiedBy:req.body.fullName,modifiedOn:new Date()}});
     
        response(req, res, activity, 'Level-2', 'Delete-ShareAds', true, 200, data, clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-ShareAds', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh khan  
 * @date 30-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update shareAds post
 */

export let updateShareAds = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const shareAdsData: ShareAdsDocument = req.body;
            const updateShareAds = await ShareAds.findByIdAndUpdate({ _id: req.body._id }, {
                $set: {
                    advertisementTitle: shareAdsData.advertisementTitle,
                    advertisementDescription: shareAdsData.advertisementDescription,
                    advertisementType: shareAdsData.advertisementType,
                    allocatedAmount: shareAdsData.allocatedAmount,
                    amoutPerView: shareAdsData.amoutPerView,
                    likes: shareAdsData.likes,
                    modifiedBy: shareAdsData.modifiedBy,
                    modifiedOn: shareAdsData.modifiedOn
                }
            });
            response(req, res, activity, 'Level-2', 'Update-shareAdsPost', true, 200, updateShareAds, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-shareAdsPost', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
}

/**
 * @author Santhosh khan  
 * @date 30-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to filter shareAds post
 */

export let getFilterShareAds = async (req, res, next) => {
    try{
        var findQuery;
        var andList:any = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        if(req.body.fileType){
            andList.push({ fileType: req.body.fileType });
        }
        if(req.body.user){
            andList.push({ user: req.body.user });
        }
        if(req.body.postDate){
            var date= new Date(req.body.postDate).getDate();
            var toDate= new Date(new Date(req.body.postDate).setDate(date+1));
            andList.push({ createdOn: { $gte: req.body.postDate, $lte: toDate } });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const postList = await ShareAds.find(findQuery).sort({ createdOn: -1 }).skip(limit * page).limit(limit);
        const postCount = await ShareAds.find(findQuery).count();
        response(req, res, activity, 'Level-2', 'Get-Filter-ShareAdsPost', true, 200, {postList,postCount}, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter-ShareAdsPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author MOHANRAJ
 * @date 10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to count on advertiser post Share ads
 * */

export let countShareAds = async (req, res, next) => {
    try {
        const data = await ShareAds.find({advertiserId:req.query.advertiserId}).count();
        response(req,res,activity,'Level-2','Count-ShareAds',true,200,data,clientError.success.fetchedSuccessfully);
        
    } catch (error: any) {
        response(req,res,activity,'Level-3','Count-ShareAds',false,500,{},errorMessage.internalServer,error.message)
        
    }
}

/**
 * @author MOHANRAJ
 * @date 18-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to count on advertiser post Share ads
 * */
export let getAdvertiserPostedShareAds = async (req, res, next) => {
    try {
        const data = await ShareAds.find({advertiserId:req.query._id},{likeCount:0,isDeleted:0,status:0,createdBy:0,createdOn:0,modifiedOn:0,modifiedBy:0,likeUser:0,comment:0})
        response(req,res,activity,'Level-1','Get-AdvertiserPostedShareAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req,res,activity,'Level-3','Get-AdvertiserPostedShareAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author MOHANRAJ
 * @date 19-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to share shareAds post
 * */

export let earnShareAds = async (req, res, next) => {
    try {
        const data = await ShareAds.findOne({ _id: req.body._id },{amoutPerShare:1,_id:0})
        if(data !== null){
        const userdata = await Users.findByIdAndUpdate({_id:req.body.userId},{$inc:{earnings:data.amoutPerShare}});
        response(req, res, activity, 'Level-2', 'Earn-ShareAds', true, 200, data, clientError.success.updateSuccess);
    }}
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Earn-ShareAds', false, 500, {}, errorMessage.internalServer, err.message);
    }
    
}