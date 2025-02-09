import {Advertiser,AdvertiserDocument } from "../model/advertiser.model";
import { Image } from "../model/imageAds.model";
import { Video } from "../model/videoAds.model";
import { Url } from "../model/url.model";
import { Users} from "../model/users.model";
import { response ,generate,sendReferralCode,sendEmailOtp, sendOtp} from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";  
import { validationResult } from "express-validator";
import { encrypt,decrypt, hashPassword } from "../helper/Encryption";
import * as TokenManager from "../utils/tokenManager";

var activity="Advertiser";
var mobileNumber = 9988776655;

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update advertiser details
 */

export let saveAdvertiser = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const advertiserData = await Advertiser.findOne({ $and: [{ isDeleted: false },{mobileNumber:req.body.mobileNumber}, { email: req.body.email },] });
            const usersData = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email },{mobileNumber:req.body.mobileNumber}] });
            if(!advertiserData && !usersData)
            {
                const advertiserDetails : AdvertiserDocument = req.body;  
                if(advertiserDetails.password === req.body.confirmPassword){
                    advertiserDetails.password =await encrypt(advertiserDetails.password);
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    advertiserDetails.otp=otp,
                    advertiserDetails.coinValue = 1000;                    
                    advertiserDetails.myReferralCode=generate(6); //generate referral code
                    let uniqueId = Math.floor(1000 + Math.random() * 9000);
                    advertiserDetails.userName=advertiserDetails.name+"_"+uniqueId;
                    const advertiserData = new Advertiser(advertiserDetails);
                    let insertAdvertiser = await advertiserData.save();
                    const token=await TokenManager.CreateJWTToken({         
                        id:insertAdvertiser["_id"],
                        name:insertAdvertiser["name"],
                    });
                    if(insertAdvertiser){
                        await addRewards(insertAdvertiser.referralCode)
                     } 
                    const result={}
                    result['_id']=insertAdvertiser._id;
                    result['name']=insertAdvertiser.name;
                    result['otp']=insertAdvertiser.otp;
                    let finalResult = {};
                    finalResult["loginType"] = 'advertiser';
                    finalResult["advertiserDetails"] = result;
                    finalResult["token"] = token;
                    sendOtp(insertAdvertiser.mobileNumber,insertAdvertiser.otp)
                    response(req, res, activity, 'Level-2', 'Save-Advertiser', true, 200, finalResult, clientError.success.registerSuccessfully);
                  
            }else{
                response(req,res,activity,'Level-3','Save-Advertiser',false,200,{},'Password and confirm password not matched');
            }
        } 
            else{
                response(req, res, activity, 'Level-3', 'Save-Advertiser', true, 200, {}, 'Email (or) Mobile Number already registered');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Advertiser', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Advertiser', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



/**
 * @author Mohanraj V 
 * @date 28-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to add reawrdson user function
 */


async function addRewards(referralCode) {
    const userData = await Advertiser.updateMany({ myReferralCode: referralCode }, { $inc: { coinValue: 100 } });
    if (userData) { 
        const companyUser = await Users.updateMany({mobileNumber:mobileNumber},{$inc:{earnings:-100}})
        console.log(("rewards added")); 
    }       
   }

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all advertiser details
 */
export let getAllAdvertiser = async (req, res, next) => {
    try {
        const advertiserData = await Advertiser.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-Advertiser', true, 200, advertiserData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Advertiser', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get a single advertiser.
 */

export let getSingleAdvertiser = async (req, res, next) => {
    try {
        const data = await Advertiser.findOne({_id:req.query._id},{fcm_Token:0})
        response(req,res,activity,'Level-1','Get-SingleAdvertiser',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-SingleAdvertiser', false, 500, {}, errorMessage.internalServer, err.message);
        
    }
};

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update advertiser details.
 */

export let updateAdvertiser = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const advertiserDetails: AdvertiserDocument = req.body;            
            const advertiserData=await Advertiser.findOne({$and:[{_id:{$ne:advertiserDetails._id}},{email:advertiserDetails.email},{isDeleted:false}]});
            const usersData=await Users.findOne({$and:[{email:advertiserDetails.email},{isDeleted:false}]});
            
            if(!advertiserData){
                const updateAdvertiser= new Advertiser(advertiserDetails);
                let insertAdvertiser = await updateAdvertiser.updateOne({
                    $set:{
                        email:advertiserDetails.email,
                        name:advertiserDetails.name,
                        gender:advertiserDetails.gender,
                        address:advertiserDetails.address,
                        dob:advertiserDetails.Dob,
                        profileUrl:advertiserDetails.profileUrl,
                        companyName:advertiserDetails.companyName,
                        brandProfileName:advertiserDetails.brandProfileUrl,
                        advertiserCategory:advertiserDetails.advertiserCategory,
                        billingAddress:advertiserDetails.billingAddress,
                        appPackageUrl:advertiserDetails.appPackageUrl,
                        mobileNumber:advertiserDetails.mobileNumber,
                        modifiedOn:advertiserDetails.modifiedOn,
                        modifiedBy:advertiserDetails.modifiedBy
                    } ,      
                },{new:true}
                );
                const userData1 = await Advertiser.findOne({_id:advertiserDetails._id},{email:1,name:1,gender:1,profileUrl:1,companyName:1,
                address:1,dob:1,})
                response(req, res, activity, 'Level-2', 'Update-Advertiser', true, 200, userData1, clientError.success.updateSuccess);
            }else{
                response(req, res, activity, 'Level-3', 'Update-Advertiser', true, 422, {}, 'Email already registered');
            }
            
        } catch (error: any) {
            response(req, res, activity, 'Level-3', 'Update-Advertiser', false, 500, {}, errorMessage.internalServer, error.message);
        }
    }else{
    response(req, res, activity, 'Level-3', 'Update-Advertiser', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
}
};

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete advertiser
 */
export let deletedAdvertiser = async (req, res, next) => {
    try {
        let id = req.query._id;
        let {modifiedBy,modifiedOn} = req.body;
        const data = await Advertiser.findByIdAndUpdate({_id:id},
            {$set:{isDeleted:true,
             modifiedBy:modifiedBy,
             modifiedOn:modifiedOn
    }});
    const urlData= await Url.updateMany({advertiserId:id},{isDeleted:true})
    response(req, res, activity, 'Level-2', 'Delete-Advertiser', true, 200, data, clientError.success.deleteSuccess);
    } catch (error: any) {
        response(req, res, activity, 'Level-3', 'Delete-Advertiser', false, 500, {}, errorMessage.internalServer, error.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 06-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get a advertiser referralCode
 */

export let getAdvertiserReferralCode = async (req, res, next) => {
    try {
        const data = await Advertiser.findById({_id:req.query._id},{referralCode:1})
        response(req,res,activity,'Level-1','Get-AdvertiserReferralCode',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-AdvertiserReferralCode', false, 500, {}, errorMessage.internalServer, err.message);
        
    }
};

/**
 * @author Mohanraj V 
 * @date 06-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to share referral code in advertiser
 */
export let shareReferralCode = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
           
            const data = await Advertiser.findById({_id:req.body._id},{myReferralCode:1})
            if(data !== null){
            const referData = await sendReferralCode(req.body.email,data.myReferralCode)
            const referredData = await Advertiser.findByIdAndUpdate({_id:req.body._id},
                {$set:{referredDetails:{
                    email:req.body.email,
                    createdOn:new Date(),
                                }}});
            response(req,res,activity,'Level-1','Share-ReferralCode',true,200,referData,clientError.success.fetchedSuccessfully)
            } else {
            console.log("data is null");
            }
        }catch (err:any) {
                response(req, res, activity, 'Level-3', 'Share-ReferralCode', false, 500, {}, errorMessage.internalServer, err.message);    
        } 
    }else{
        response(req, res, activity, 'Level-3', 'Share-ReferralCode', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Haripriyan K
 * @date 27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all the referred person details
 */
export let getReferredPersonDetails = async (req, res, next) => {
    try {
        const data = await Advertiser.findById({_id:req.query._id},{myReferralCode:1});
        const search = await Advertiser.find({$and :[{referralCode:data?.myReferralCode},{isDeleted: false}]});
        if (search !== null) {
            const signup = await Advertiser.findById({_id:req.query._id},{referredDetails:{email:1}})
            response(req,res,activity,'Level-1','Get-ReferredPersonDetails',true,200,signup,clientError.success.fetchedSuccessfully)
        }
         }catch(err:any) {
        response(req, res, activity, 'Level-3', 'Get-ReferredPersonDetails', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj
 * @date 4-01-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is use toget notifications 
 */
export let advertiserGetNotify = async (req, res, next) => {
    try {
        const data = await Advertiser.findOne({ _id: req.query._id }, { notification: 1 });
        response(req, res, activity, 'Level-2', 'AdvertiserGet-Notify', true, 200, data, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'AdvertiserGet-Notify', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Mohanraj v
 * @date 17-01-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get the single advertiser refer in candidates view
 */

export let getReferredAdvertiser = async (req,res,next) => {
    try {        
        const user = await Advertiser.findById({_id:req.query._id},{myReferralCode:1,_id:0});        
        const data = await Advertiser.find({referralCode:user?.myReferralCode},{fullName:1,profileUrl:1});
        response(req, res, activity, 'Level-1', 'Get-ReferedAdvertiser', true, 200, data, clientError.success.fetchedSuccessfully)
    }catch(err:any) {
        response(req, res, activity, 'Level-3', 'Get-ReferedAdvertiser', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
 * @author Mohanraj v
 * @date 17-01-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get the single user refer in candidates view
 */
export let getTrendingReferAdvertiser = async (req,res,next) => {
    try {
        const data = await Advertiser.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: { referralCode: "$referralCode" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { referralCode: "$_id.referralCode", count: "$count" } },
        ]);
        let trendingList:any=[];
        // data.forEach(async (result) => //don't delete this
        for(const result of data)
        {
            if (result?.referralCode !== null && result?.referralCode !== "" && result?.count >=2) {
            const userDetails = await Advertiser.findOne({$and:[{isDeleted:false},{myReferralCode:result.referralCode}]});
                let user={};
                        user["Referral Code:"]= result.referralCode;
                        user["Count:"]= result.count;
                        user["Advertiser Name:"]= userDetails?.name;
                        user["Advertiser ProfileUrl:"]= userDetails?.profileUrl;
               trendingList.push(user)
            }
        };      
        console.log(trendingList);
        response(req, res, activity, 'Level-1', 'Get-ReferedUser', true, 200, {trendingList}, clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'User-Task', false, 500, {}, errorMessage.internalServer, err.message)
    }
}
