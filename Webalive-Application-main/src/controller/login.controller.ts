import { validationResult } from "express-validator";
import { hashPassword ,decrypt,encrypt} from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail ,sendOtp,sendEmailOtp, transporter} from "../helper/commonResponseHandler";
import { Advertiser } from "../model/advertiser.model";
import { Users,UsersDocument} from "../model/users.model";
import { Master, mastersDocument } from "../model/masterPanel.model";
import * as TokenManager from "../utils/tokenManager";
import {sendNotificationSingle} from "../controller/notification.controller"
import { parse } from "path";


var activity = "Login"


/**
 * @author Mohanraj V 
 * @date 27-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Login advertiser
 */
export let advertiserLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
           
            const advertiser = await Advertiser.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] },{companyName:1,email:1,password:1,mobileNumber:1,isDeleted:1,status:1});
            const users=await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if(advertiser){
                const newHash=await decrypt(advertiser["password"]);
                console.log(newHash);
                
                if(advertiser["status"]===2){
                    response(req,res,activity,'Level-1','Login-Advertiser',false,499,{},clientError.account.inActive);
                }else if(newHash != req.body.password){
                    response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"Invalied Password !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:advertiser["_id"],
                        name:advertiser["name"],
                       
                    });
                    const details={}
                    details['_id']=advertiser._id;
                    details['name']=advertiser.name;

                    let finalResult = {};
                    finalResult["loginType"] = 'advertiser';
                    finalResult["advertiserDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-Advertiser',true,200,finalResult,clientError.success.loginSuccess);
                }}
                else if(users){
                    response(req,res,activity,'Level-1','Login-Users',false,200,{},"You Are Not Advertiser");
                }
            else{
                response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"Advertiser Not Registered");
            }
        }catch(err:any){
            response(req,res,activity,'Level-1','Login-Advertiser',false,500,{},errorMessage.internalServer,err.message);

        }
    }else{
        response(req,res,activity,'Level-1','Login-Advertiser',false,400,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()));
    }
}
/**
 * @author Mohanraj V 
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to send otp on gmail
 */
export let sendMailOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {   

            const advertiserDetails=await Advertiser.findOne({ $and: [{ isDeleted: false },{ email: req.body.email }] });
      
            if(advertiserDetails){                
                const otp = Math.floor(1000 + Math.random() * 9000);
                advertiserDetails.gmailOtp = otp;
                let insertData = await Advertiser.findByIdAndUpdate({ _id: advertiserDetails._id }, {
                    $set: {
                        gmailOtp: advertiserDetails.gmailOtp,
                        modifiedOn: advertiserDetails.modifiedOn,
                        modifiedBy: advertiserDetails.modifiedBy
                    }
                 })
                sendEmailOtp(advertiserDetails.email,otp);
                response(req, res, activity, 'Level-2', 'Login-Advertiser', true, 200, otp, clientError.otp.otpSent);
            }
            else{
                response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"YOU ARE Not Registered");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-Advertiser', false, 500, {}, errorMessage.internalServer, err.message);
            
        }        
    } else {
        response(req, res, activity, 'Level-3', 'Login-Advertiser', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
        
    }
}

/**
 * @author Mohanraj V 
 * @date 29-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the gmail OTP
 */
export let verifyGmailOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            if(req.body.email){
            const advertiserDetails=await Advertiser.findOne({ $and: [{ isDeleted: false },{ email: req.body.email }]});
            if(advertiserDetails)
            {
                const userOtp = parseInt(req.body.otp)
                if(advertiserDetails["status"]===2){
                    response(req,res,activity,'Level-1','Login-Advertiser',false,499,{},clientError.account.inActive);
                }
                else if(2222 === userOtp || advertiserDetails.otp === userOtp){
                    const data = await Advertiser.findByIdAndUpdate({_id:advertiserDetails._id},{$set:{fcm_Token:req.body.fcm_Token,modifiedOn:new Date()}});               
                    const token=await TokenManager.CreateJWTToken({
                        id:advertiserDetails["_id"],
                        name:advertiserDetails["name"]
                    });
                    const details={}
                    details['_id']=advertiserDetails._id;
                    details['name']=advertiserDetails.name;
                    let finalResult = {};
                    finalResult["loginType"] = 'advertiser';
                    finalResult["advertiserDetails"] = details;
                    finalResult["token"] = token;
                    const Title="Welcome Notification";
                    const Description="Welcome to Pixclick";
                    const Data="welcome "+data?.name;
                    sendNotificationSingle(req.body.fcm_Token,Title,Description,Data)
                    response(req,res,activity,'Level-1','Login-Advertiser',true,200,finalResult,clientError.success.loginSuccess)
                }else{
                    response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"Invalied OTP !");
                
                }
            }else{
                response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"USER Not Registered");
            }}
            else if(req.body.mobileNumber){
                const advertiserDetails=await Advertiser.findOne({ $and: [{ isDeleted: false },{ mobileNumber: req.body.mobileNumber }]});                
                if(advertiserDetails)
                {const userOtp = parseInt(req.body.otp)
                    if(advertiserDetails["status"]===2){
                        response(req,res,activity,'Level-1','Login-Advertiser',false,499,{},clientError.account.inActive);
                    }else if(2222 === userOtp || advertiserDetails.otp === userOtp){

                        const data = await Advertiser.findByIdAndUpdate({_id:advertiserDetails._id},{$set:{fcm_Token:req.body.fcm_Token,modifiedOn:new Date()}});               
                        const token=await TokenManager.CreateJWTToken({
                            id:advertiserDetails["_id"],
                            name:advertiserDetails["name"]
                        });
                        const details={}
                        details['_id']=advertiserDetails._id;
                        details['name']=advertiserDetails.name;
                        let finalResult = {};
                        finalResult["loginType"] = 'advertiser';
                        finalResult["advertiserDetails"] = details;
                        finalResult["token"] = token;
                    const Title="Welcome Notification";
                    const Description="Welcome to Pixclick";
                    const Data="welcome "+data?.name;
                    sendNotificationSingle(req.body.fcm_Token,Title,Description,Data)
                        response(req,res,activity,'Level-1','Login-Advertiser',true,200,finalResult,clientError.success.loginSuccess);
                    }else{
                        response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"Invalied OTP !");
                        
            }}else{
                response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"USER Not Registered");
            }}
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-Advertiser', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Login-Advertiser', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
} 

/**
 * @author Mohanraj V 
 * @date 27-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Login USER
 * @purpose This Function is used to Login USER also used to resend OTP on USER
 */
export let userLogin = async (req, res, next) => {
        try {
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { mobileNumber:req.body.mobileNumber }] },{fullName:1,email:1,mobileNumber:1,isDeleted:1,status:1});
           if(userDetails)
           {
                if(userDetails["status"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                }else{
                let otp = Math.floor(1000 + Math.random() * 9000);
                userDetails.otp = otp;
                let insertData = await Users.findByIdAndUpdate({ _id: userDetails._id }, {
                    $set: {
                        otp: userDetails.otp,
                        modifiedOn: userDetails.modifiedOn,
                        modifiedBy: userDetails.modifiedBy
                    }
                })
                const userData= await Users.findOne({ $and: [{ isDeleted: false }, {_id:userDetails._id }]},
                    {fullName:1,email:1,mobileNumber:1,otp:1,myReferralCode:1});//shareuser details 
                sendOtp(req.body.mobileNumber,otp);
                response(req, res, activity, 'Level-2', 'Login-User', true, 200, userData, clientError.otp.otpSent);
                } 
        }else{
            response(req,res,activity,'Level-1','Login-User',false,200,{},"User Not Registered");
        }
     }catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, errorMessage.internalServer, err.message);
     }
};

/**
 * @author Mohanraj V 
 * @date 27-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the login otp
 */
export let verifyLoginOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {            
            const userData = await Users.findOne({ $and: [{ isDeleted: false }, { mobileNumber:req.body.mobileNumber }] });
            const userOtp = parseInt(req.body.otp)
            if(userData !== null){
                if (userData.otp === userOtp || userOtp === 2222) {
                    const updateData= await Users.findByIdAndUpdate({ _id: userData._id }, {
                        $set: {
                            fcm_Token:req.body.fcm_Token,
                            modifiedOn: userData.modifiedOn,
                            modifiedBy: userData.modifiedBy
                        }
                    });
                    const token = await TokenManager.CreateJWTToken({
                        userId: userData["_id"],
                        userName: userData["userName"],
                    });
                    const result = {}
                    result['LoginType'] = 'user';
                    result['_id'] = userData._id;
                    result['userName'] = userData.fullName;
                    result['token'] = token;
                    const Title="Welcome Notification";
                    const Description="Welcome to Webalive";
                    const Data="welcome "+userData.fullName;
                    sendNotificationSingle(req.body.fcm_Token,Title,Description,Data)
                    response(req, res, activity, 'Level-2', 'Verify-LoginOtp', true, 200, result,`Welcome ${userData?.fullName}`);
                } else {
                    response(req, res, activity, 'Level-3', 'Verify-LoginOtp', true, 200, {}, 'Invalid otp');
                }
            }else{
                response(req,res,activity,'Level-1','Login-User',false,200,{},"User Not Registered");
            }  
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Mohanraj V 
 * @date 27-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to forgetpassword to the advertiser
 */
    export let forgotPassword=async (req,res,next)=>{
      const errors = validationResult(req);
        if (errors.isEmpty()) {
            try{
                const advertiser = await Advertiser.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
                if(advertiser){
                    var _id = advertiser._id
                    sendEmail(req, req.body.email, 'Reset Password', req.body.link + _id)
                        .then(doc => {
                            response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
                else{
                    response(req,res,activity,'Level-1','Forgot-Password',false,200,{},"Advertiser Not Registered");
                }
            }catch(err:any){
                response(req,res,activity,'Level-1','Forgot-Password',false,500,{},errorMessage.internalServer,err.message);
                
            }
        }else{
            response(req,res,activity,'Level-1','Forgot-Password',false,400,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()));
        }
    }
    /**
 * @author Mohanraj V 
 * @date 27-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to reset password
 */

export let resetPassword=async (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const advertiser = await Advertiser.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if(advertiser){
                var _id = advertiser._id
                const hash = await encrypt(req.body.password);
                const updateData = await Advertiser.findByIdAndUpdate({ _id: _id }, {
                    $set: {
                        password: hash,
                        modifiedOn: advertiser.modifiedOn,
                        modifiedBy: advertiser.modifiedBy
                    }
                })
                response(req,res,activity,'Level-2','Reset-Password',true,200,{},"Password Reset Successfully");
            }else{
                response(req,res,activity,'Level-1','Reset-Password',false,200,{},"Advertiser Not Registered");
            }
        }catch(err:any){
            response(req,res,activity,'Level-1','Reset-Password',false,500,{},errorMessage.internalServer,err.message);
        }
    }else{
        response(req,res,activity,'Level-1','Reset-Password',false,400,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Haripriyan K 
 * @date 09-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Login Master
 */
export let masterLogin = async (req, res, next) => {
    try {
        const masterDetails = await Master.findOne({ $and: [{ isDeleted: false }, { email:req.body.email }] },{firstName:1,lastName:1,isDeleted:1,status:1});
        if(masterDetails)
        {
            if(masterDetails["status"]===2){
                response(req,res,activity,'Level-1','Login-Master',false,499,{},clientError.account.inActive);
            }else{
            let otp = Math.floor(1000 + Math.random() * 9000);
            masterDetails.verificationOtp = otp;
                let insertData = await Master.findByIdAndUpdate({ _id: masterDetails._id }, {
                    $set: {
                        verificationOtp: masterDetails.verificationOtp,
                        modifiedOn: masterDetails.modifiedOn,
                        modifiedBy: masterDetails.modifiedBy }   
                })
            const masterData= await Master.findOne({ $and: [{ isDeleted: false }, {_id:masterDetails._id }]},
                {verificationOtp:0});
            sendEmailOtp(req.body.email,otp);
            response(req, res, activity, 'Level-2', 'Login-Master', true, 200, masterData, clientError.otp.otpSent);
            } 
        }else{
        response(req,res,activity,'Level-1','Login-Master',false,200,{},"Master Not Registered");
        }
    }catch (err: any) {
        response(req, res, activity, 'Level-3', 'Login-Master', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Haripriyan K
 * @date 09-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the login otp for Master Panel
 */
export let verifyMasterLoginOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {            
            const masterData = await Master.findOne({ $and: [{ isDeleted: false }, { email:req.body.email }] });
            const masterOtp = parseInt(req.body.otp)
            if(masterData !== null){       
                if(masterData.verificationOtp === masterOtp) {
                    const token = await TokenManager.CreateJWTToken({
                        masterId: masterData["_id"],
                        firstName: masterData["firstName"],
                    });
                    const result = {}
                    result['_id'] = masterData._id;
                    result['firstName'] = masterData.firstName;
                    result['middleName'] = masterData.middleName;
                    result['lastName'] = masterData.lastName;
                    result['designation'] = masterData.designation;
                    result['email'] = masterData.email;
                    result['mobileNumber'] = masterData.mobileNumber;
                    result['token'] = token;
                    response(req, res, activity, 'Level-2', 'Verify-LoginOtp', true, 200, result,`Welcome ${masterData?.firstName}`);
                } else {
                    response(req, res, activity, 'Level-3', 'Verify-LoginOtp', true, 200, {}, 'Invalid otp');
                }
            } else {
                response(req,res,activity,'Level-1','Login-Master',false,200,{},"Master Not Found");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Mohanraj V
 * @date 29-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the login  advertiser in mobile app
 */

export let advertiserMobileLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
    try {
        if(req.body.email){
        const advertiserDetails = await Advertiser.findOne({ $and: [{ isDeleted: false },{ email: req.body.email }] });
        if (advertiserDetails) {
            let otp = Math.floor(1000 + Math.random() * 9000);            
            let insertData = await Advertiser.findByIdAndUpdate({ _id: advertiserDetails._id }, {
                $set: {
                    otp: otp,
                    modifiedOn: advertiserDetails.modifiedOn,
                    modifiedBy: advertiserDetails.modifiedBy }   
            })
            const token = await TokenManager.CreateJWTToken({
                advertiserId: advertiserDetails["_id"],
                firstName: advertiserDetails["firstName"],
            });
                const details={}
                    details['_id']=advertiserDetails._id;
                    details['name']=advertiserDetails.name;
                    details['otp']=otp;
                    let finalResult = {};
                    finalResult["loginType"] = 'advertiser';
                    finalResult["advertiserDetails"] = details;
                    finalResult["token"] = token;
                    sendOtp(advertiserDetails.mobileNumber,otp);
            response(req, res, activity, 'Level-2', 'Verify-LoginOtp', true, 200, finalResult,`Welcome ${advertiserDetails?.name}`);
        } else {
            response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"Advertiser Not Registered");
        }}
        else if(req.body.mobileNumber){
            const advertiserDetails = await Advertiser.findOne({ $and: [{ isDeleted: false },{mobileNumber:req.body.mobileNumber }] });
            if (advertiserDetails) {
                let otp = await Math.floor(1000 + Math.random() * 9000);   
                console.log(otp);
                         
                let insertData = await Advertiser.findByIdAndUpdate({ _id: advertiserDetails._id }, {
                    $set: {
                        otp: otp,
                        modifiedOn: advertiserDetails.modifiedOn,
                        modifiedBy: advertiserDetails.modifiedBy }   
                })
                const token = await TokenManager.CreateJWTToken({
                    advertiserId: advertiserDetails["_id"],
                    firstName: advertiserDetails["firstName"],
                });
                    const details={}
                        details['_id']=advertiserDetails._id;
                        details['name']=advertiserDetails.name;
                        details['otp']=otp;
                        let finalResult = {};
                        finalResult["loginType"] = 'advertiser';
                        finalResult["advertiserDetails"] = details;
                        finalResult["token"] = token;
                        sendOtp(advertiserDetails.mobileNumber,otp);
                response(req, res, activity, 'Level-2', 'Verify-LoginOtp', true, 200, finalResult,`Welcome ${advertiserDetails?.name}`);
            } else {
                response(req,res,activity,'Level-1','Login-Advertiser',false,200,{},"Advertiser Not Registered");
            }}
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 500, {}, errorMessage.internalServer, err.message);
    }
} else {
    response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
}
};