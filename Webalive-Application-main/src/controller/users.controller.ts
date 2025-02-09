import { express } from "express";
import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, generate, sendOtp, formatDate } from "../helper/commonResponseHandler";
import { Users, UsersDocument } from "../model/users.model";
import { Advertiser } from "../model/advertiser.model";
import *  as TokenManager from "../utils/tokenManager";
import { Url } from "../model/url.model";
import { TimeManagement, TimeManagementDocument } from "../model/timeManagement.model";
import { sendNotificationSingle } from "../controller/notification.controller"


var activity = "Users";
var mobileNumber = 9988776655;

/**
 * @author Mohanraj V / Santhosh
 * @date 23-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create User.
 */
export let saveUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const usersData = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }, { mobileNumber: req.body.mobileNumber }] });
            const advertiserData = await Advertiser.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }, { mobileNumber: req.body.mobileNumber }] });
            if (!usersData && !advertiserData) {
                const usersDetails: UsersDocument = req.body;
                usersDetails.myReferralCode = generate(6); //generate referral code
                let otp = Math.floor(1000 + Math.random() * 9000);
                usersDetails.otp = otp
                const uniqueId = Math.floor(Math.random() * 10000);// generate unique idon username
                usersDetails.userName = "@" + usersDetails.fullName + "_" + uniqueId
                const createData = new Users(usersDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["fullName"],
                });
                if (insertData) {
                    await addRewards(insertData.referralCode)
                }

                const date = await Users.findOneAndUpdate({myReferralCode:usersDetails.referralCode},{$push:{
                    referredUser:
                }})
                const result = {}
                result['_id'] = insertData._id
                result['fullName'] = insertData.fullName;
                result['userName'] = insertData.userName;
                result["mobileNumber"] = insertData.mobileNumber;
                result['myReferralCode'] = insertData.myReferralCode;
                result["otp"] = otp
                let finalResult = {};
                finalResult["loginType"] = 'users';
                finalResult["usersDetails"] = result;
                finalResult["token"] = token;
                sendOtp(insertData.mobileNumber, insertData.otp)
                response(req, res, activity, 'Level-2', 'Save-Users', true, 200, result, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Users', true, 422, {}, 'Mobilenumber (or) Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Users', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Users ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to add reawrdson user function
 */


async function addRewards(referralCode) {

    const userData = await Users.updateMany({ myReferralCode: referralCode }, { $inc: { rewards: 100 } });
    if (userData) {
        const companyUser = await Users.updateMany({ mobileNumber: mobileNumber }, { $inc: { earnings: -100 } })
        console.log(("rewards added"));
    }
}


/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Users.
 */
export let getAllUsers = async (req, res, next) => {
    try {
        const usersData = await Users.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-Users', true, 200, usersData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Users', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update user details
 */

export let updateUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const usersDetails: UsersDocument = req.body;
            const usersData = await Users.findOne({ $and: [{ _id: { $ne: usersDetails._id }, }, { email: usersDetails.email }, { isDeleted: false }] });
            const advertiserData = await Advertiser.findOne({ $and: [{ email: usersDetails.email }, { isDeleted: false }] });
            if (!usersData && !advertiserData) {
                const updateUsers = new Users(usersDetails);
                let insertUsers = await updateUsers.updateOne({
                    $set: {
                        fullName: usersDetails.fullName,
                        userName: usersDetails.userName,
                        profileUrl: usersDetails.profileUrl,
                        email: usersDetails.email,
                        dob: usersDetails.dob,
                        gender: usersDetails.gender,
                        address: usersDetails.address,
                        upi: usersDetails.upi,
                        paytm: usersDetails.paytm,
                        modifiedOn: usersDetails.modifiedOn,
                        modifiedBy: usersDetails.modifiedBy
                    }
                })
                const value2 = await Users.findById({ _id: usersDetails._id }, { fcm_Token: 1, fullName: 1, _id: 0 })
                const fcm_Token = value2?.fcm_Token;
                const Title = "Profile Update Notification";
                const Description = value2?.fullName;
                const Data = value2?.fullName + " your Profile Updated Successfully";
                sendNotificationSingle(fcm_Token, Title, Description, Data)
                response(req, res, activity, 'Level-2', 'Update-Users', true, 200, insertUsers, clientError.success.updateSuccess);
            }
            else {
                response(req, res, activity, 'Level-3', 'Update-Users', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Users', false, 500, {}, errorMessage.internalServer, err.message);

        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Users', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let getSingleUsers = async (req, res, next) => {
    try {
        const data = await Users.findById({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'Get-SingleUsers', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleUsers', false, 500, {}, errorMessage.internalServer, err.message);

    }
}

/**
 * @author Mohanraj V / Santhosh
 * @date 25-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete user .
 */

export let deletedUsers = async (req, res, next) => {
    try {
        const data = await Users.findByIdAndUpdate({ _id: req.query._id },
            { $set: { isDeleted: true, modifiedBy: req.body.fullName, modifiedOn: new Date() } });
        const data1 = await Url.findOneAndUpdate({ userId: req.query._id },
            { $set: { isDeleted: true, modifiedBy: req.body.fullName, modifiedOn: new Date() } });
        response(req, res, activity, 'Level-2', 'Delete-Users', true, 200, data, clientError.success.deleteSuccess);
    } catch (error: any) {
        response(req, res, activity, 'Level-3', 'Delete-Users', false, 500, {}, errorMessage.internalServer, error.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 06-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to getuser referralCode
 */
export let getUserReferralCode = async (req, res, next) => {
    try {
        const data = await Users.findOne({ _id: req.query._id }, { myReferralCode: 1 })
        response(req, res, activity, 'Level-1', 'Get-ReferralCode', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-ReferralCode', false, 500, {}, errorMessage.internalServer, err.message);

    }
}

/**
 * @author Haripriyan K
 * @date 01-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to follow advertiser.
 */
export let advertiserFollow = async (req, res, next) => {
    try {
        const data = await Advertiser.findByIdAndUpdate({ _id: req.body._id }, {
            $inc: { followersCount: 1 },
            $push: { followers: req.body.userId }
        })
        const follow = await Users.findById({ _id: req.body.userId }, { fullName: 1, _id: 0 })
        const value2 = await Advertiser.findById({ _id: req.body._id }, { fcm_Token: 1, _id: 0 })
        const fcm_Token = value2?.fcm_Token;
        const Title = "Follow Notification";
        const Description = follow?.fullName;
        const Data = Description + "  Started Following You";
        sendNotificationSingle(fcm_Token, Title, Description, Data)
        response(req, res, activity, 'Level-2', 'Advertiser-Follow', true, 200, data, clientError.success.updateSuccess)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Advertiser-Follow', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get followers details
 */

export let getFollowersDetails = async (req, res, next) => {
    try {
        const data = await Users.findOne({ _id: req.query._id }, { followers: 1 }).populate('followers', { fullName: 1, profileUrl: 1, userName: 1 });

        response(req, res, activity, 'Level-1', 'Get-Followers', true, 200, data, clientError.success.fetchedSuccessfully)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Followers', false, 500, {}, errorMessage.internalServer, err.message);

    }
}

/**
 * @author Haripriyan K
 * @date 01-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to unfollow advertiser.
 */
export let advertiserUnfollow = async (req, res, next) => {
    try {
        const data = await Advertiser.findByIdAndUpdate({ _id: req.body._id }, {
            $inc: { followersCount: -1 },
            $pull: { followers: req.body.userId }
        })
        response(req, res, activity, 'Level-2', 'User-UnFollow', true, 200, data, clientError.success.updateSuccess)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'User-UnFollow', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
* @author balaji murahari
* @date 10-10-2023
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to get following details
* 
*/

export let getFollowingDetails = async (req, res, next) => {
    try {
        const followingData = await Users.find({ followers: req.query._id }, { userName: 1, profileUrl: 1, fullName: 1 });
        response(req, res, activity, 'Level-2', 'GetFollowing-Details', true, 200, followingData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetFollowing-Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @date 07-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get following details
 * 
 */
export let getFollowingCount = async (req, res, next) => {
    try {
        const show = await Users.find({ followers: req.query._id }).count()
        console.log(show);

        response(req, res, activity, 'Level-2', 'GetFollowing-Count', true, 200, show, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetFollowing-Count', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @date 06-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Bank Details.
 */
export let saveBank = async (req, res, next) => {
    const errors = await validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data1 = await Users.findByIdAndUpdate({ _id: req.body._id }, {
                $set: {
                    bankDetails: {
                        bankAccountNumber: req.body.bankDetails.bankAccountNumber,
                        accountHolderName: req.body.bankDetails.accountHolderName,
                        ifscCode: req.body.bankDetails.ifscCode,
                        mobileNumber: req.body.bankDetails.mobileNumber,

                    }
                },
            });
            const data = await Users.findOne({ _id: req.body._id }, { bankDetails: 1 });
            response(req, res, activity, 'Level-2', 'Save-BankDetails', true, 200, data, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-BankDetails', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else (
        response(req, res, activity, 'Level-3', 'Save-BankDetails', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped())));
};

/**
 * @author Haripriyan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Post.
 */
export let savePost = async (req, res, next) => {
    try {
        const userData = await Users.findByIdAndUpdate({ _id: req.body._id }, {
            $push: { savedPost: req.body.postId }
        });
        const data = await Users.findOne({ _id: req.body._id }, { savedPost: 1, status: 1 });
        response(req, res, activity, 'Level-2', 'Save-Post', true, 200, data, clientError.success.savedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Save-Post', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get the saved Post.
 */
export let getSavedPost = async (req, res, next) => {
    try {
        const post = await Users.find({ _id: req.query._id }, { _id: 1 }).populate({ path: 'savedPost', populate: { path: 'advertiserId', select: 'name profileUrl' } });

        response(req, res, activity, 'Level-2', 'Get-SavedPost', true, 200, post, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SavedPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Haripriyan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to unsave the Post.
 */
export let unsavePost = async (req, res, next) => {
    try {
        const userData = await Users.findByIdAndUpdate({ _id: req.body._id }, {
            $pull: { savedPost: req.body.postId }
        });
        const data = await Users.findOne({ _id: req.body._id }, { savedPost: 1, status: 1 });
        response(req, res, activity, 'Level-2', 'UnSave-Post', true, 200, data, clientError.success.unsavedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'UnSave-Post', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get user rewards
 */

export let userRewards = async (req, res, next) => {
    try {
        const userData = await Users.findOne({ _id: req.query._id }, { rewards: 1 });
        response(req, res, activity, 'Level-2', 'Get-Rewards', true, 200, userData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Rewards', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to block the user
 */

export let blockUser = async (req, res, next) => {
    try {
        const userData = await Users.findByIdAndUpdate({ _id: req.body._id }, {
            $push: { blockedUsers: req.body.blockerId }
        });
        response(req, res, activity, 'Level-2', 'Block-User', true, 200, "", clientError.success.updateSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Block-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to unBlock the user
 */
export let unBlockUser = async (req, res, next) => {
    try {
        const userData = await Users.findByIdAndUpdate({ _id: req.body._id }, {
            $pull: { blockedUsers: req.body.blockerId }
        });
        response(req, res, activity, 'Level-2', 'UnBlock-User', true, 200, userData, clientError.success.updateSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'UnBlock-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 10-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to show the block users
 */

export let getBlockedUsers = async (req, res, next) => {
    try {
        const userData = await Users.findOne({ _id: req.query._id }).populate('blockedUsers', { name: 1, profileUrl: 1 });

        response(req, res, activity, 'Level-2', 'Get-BlockedUsers', true, 200, userData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-BlockedUsers', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 11-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to COUNT USER DETAILS
 */

export let countUser = async (req, res, next) => {
    try {
        const userData = await Users.countDocuments({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Count-User', true, 200, userData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Count-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Balaji murahari
 * @date 12-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is use to send notifications
 */
export let userGetNotify = async (req, res, next) => {
    try {
        const data = await Users.findOne({ _id: req.query._id }, { notification: 1 });
        response(req, res, activity, 'Level-2', 'UserGet-Notify', true, 200, data, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'UserGet-Notify', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj V 
 * @date 11-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update paytm and upi details
 */

export let updatePaytmAndUPI = async (req, res, next) => {
    try {
        const usersDetails: UsersDocument = req.body;
        const updateUsers = new Users(usersDetails);
        let insertUsers = await updateUsers.updateOne({
            $set: {
                upi: usersDetails.upi,
                paytm: usersDetails.paytm,
                modifiedOn: usersDetails.modifiedOn,
                modifiedBy: usersDetails.modifiedBy
            }
        });
        const data = await Users.findOne({ _id: req.body._id }, { upi: 1, paytm: 1 });
        response(req, res, activity, 'Level-2', 'Update-PaytmAndUPI', true, 200, data, clientError.success.updateSuccess);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-PaytmAndUPI', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan
 * @date 23-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all followers
 */
export let getAllFollowers = async (req, res, next) => {
    try {
        const followers = await Users.findById({ _id: req.query._id }, { followers: 1, _id: 0 })
        response(req, res, activity, 'Level-1', 'Get-AllFollowers', true, 200, followers, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-AllFollowers', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan
 * @author Mohanraj
 * @date 05-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to upgrade plan for users
 */
export let upgradePlan = async (req, res, next) => {
    try {
        const value = await Users.findOne({ $and: [{ _id: req.body._id }, { isDeleted: false }] })
        const userPlan = req.body.plan;
        // date set
        const today = new Date(); // Get the current date and time
        // Extract year, month, and day components from today's date
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Month starts from 0, so adding 1 to get the correct month
        const day = today.getDate();
        // Create date formet with year, month, and day+
        
        const todayDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if (value == null) {
            response(req, res, activity, 'Level-3', 'Upgrade-Plan', true, 500, {}, errorMessage.internalServer, 'User Not Found');
        } else {
            if (userPlan == 1) {
                const data = await Users.findByIdAndUpdate({ _id: req.body._id }, {
                    $set: { plan: 1, planActivation: true, planActivationDayCount: 30 }, $push: { planActiveMonths: { date: todayDateString, plan: userPlan } }
                });
                response(req, res, activity, 'Level-2', 'Upgrade-Plan', true, 200, data, clientError.success.updateSuccess);
            } else if (userPlan == 2) {
                const data = await Users.findByIdAndUpdate({ _id: req.body._id }, {
                    $set: { plan: 2, planActivation: true, planActivationDayCount: 30 }, $push: { planActiveMonths: { date: todayDateString, plan: userPlan } }
                });
                response(req, res, activity, 'Level-2', 'Upgrade-Plan', true, 200, data, clientError.success.updateSuccess);
            } else if (userPlan == 3) {
                const data = await Users.findByIdAndUpdate({ _id: req.body._id }, {
                    $set: { plan: 3, planActivation: true, planActivationDayCount: 30 }, $push: { planActiveMonths: { date: todayDateString, plan: userPlan } }
                });
                response(req, res, activity, 'Level-2', 'Upgrade-Plan', true, 200, data, clientError.success.updateSuccess);
            } else {
                response(req, res, activity, 'Level-2', 'Upgrade-Plan', true, 200, {}, errorMessage.internalServer, 'Please upgrade your plan');
            }
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Upgrade-Plan', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj v
 * @date 05-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to upgrade plan for users
 */

export let taskManagement = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userId = req.body.userId;
            const userData = await Users.findOne({ _id: userId });
            if (!userData) {
                response(req, res, activity, 'Level-3', 'User-Task', false, 200, {}, 'User Not Found')
            } else {
                if (userData?.plan == 0) {
                    response(req, res, activity, 'Level-3', 'User-Task', false, 200, {}, errorMessage.internalServer, 'Please upgrade your plan')
                } else if (userData?.planActivationDayCount === 0) {
                  }
                else {
                    const today = new Date(); // Get the current date and time
                    // Extract year, month, and day components from today's date
                 const userData = await Users.findByIdAndUpdate({ _id: userId }, { $set: { plan: 0, planActivation: false, planActivationDayCount: 0 } })
                    response(req, res, activity, 'Level-3', 'User-Task', false, 200, {}, errorMessage.internalServer, 'Your plan has expired')
                     const year = today.getFullYear();
                    const month = today.getMonth() + 1; // Month starts from 0, so adding 1 to get the correct month
                    const day = today.getDate();
                    // Create date formet with year, month, and day
                    const todayDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

                    console.log("Today's Date:", todayDateString);
                    const todayTask = await TimeManagement.findOne({ $and: [{ userId: userId }, { date: { $eq: todayDateString } }] });
                    if (!todayTask) {
                        const userData = await Users.findById({ _id: userId }, { oldTaskId: 1 });
                        console.log("userData", userData);

                        if (userData?.oldTaskId) {

                            const oldCount = await TimeManagement.findById({ _id: userData?.oldTaskId }, { clickCount: 1 });
                            const data = await Users.findByIdAndUpdate({ _id: userId }, {
                                $inc: { planActivationDayCount: -1 },
                                $set: { todayClickCount: 0 }
                            },);
                        }
                        console.log("today created");
                        const usersDetails: TimeManagementDocument = req.body;
                        usersDetails.date = todayDateString;
                        const createData = new TimeManagement(usersDetails);
                        let insertData = await createData.save();

                        const countAdd = await Users.findByIdAndUpdate({ _id: userId }, { $set: { oldTaskId: insertData._id } });
                        response(req, res, activity, 'Level-2', 'User-Task', true, 200, insertData, "Today Task Created Successfully")
                    }
                    else {
                        if (userData?.plan == 1) {
                            console.log("plan 1");
                            const updateData = await TimeManagement.findOneAndUpdate({ _id: todayTask._id }, { $inc: { clickCount: 1 } }, { new: true });
                            const addCount = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { todayClickCount: 1, totalClickCount: 1 } }, { new: true });
                            const count = await TimeManagement.findById({ _id: todayTask._id })
                            if (count?.clickCount == 10) {
                                const data = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { earnings: 10 } })
                                // response(req, res, activity, 'Level-3', 'User-Task', false, 200, {}, "Your today task is completed successfully", 'Otherwise Please upgrade your plan')
                            }
                            response(req, res, activity, 'Level-2', 'User-Task', true, 200, count, "Today Task Updated Successfully")
                        }

                        if (userData?.plan == 2) {
                            console.log("hello");
                            const updateData = await TimeManagement.findOneAndUpdate({ _id: todayTask._id }, { $inc: { clickCount: 1 } }, { new: true });
                            const addCount = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { todayClickCount: 1, totalClickCount: 1 } }, { new: true });
                            const count = await TimeManagement.findById({ _id: todayTask._id })
                            if (count?.clickCount == 500) {
                                const data = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { earnings: 100 } })
                                // response(req, res, activity, 'Level-3', 'User-Task', false, 200, {}, "Your today task is completed successfully", 'Otherwise Please upgrade your plan')
                            }
                            response(req, res, activity, 'Level-2', 'User-Task', true, 200, count, "Today Task Updated Successfully")
                        }
                        if (userData?.plan == 3) {
                            console.log("hello");
                            const updateData = await TimeManagement.findOneAndUpdate({ _id: todayTask._id }, { $inc: { clickCount: 1 } }, { new: true });
                            const addCount = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { todayClickCount: 1, totalClickCount: 1 } }, { new: true });
                            const count = await TimeManagement.findById({ _id: todayTask._id })
                            if (count?.clickCount == 1000) {
                                const data = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { earnings: 300 } })
                                // response(req, res, activity, 'Level-3', 'User-Task', false, 200, {}, "Your today task is completed successfully", 'Otherwise Please upgrade your plan')
                            }
                            response(req, res, activity, 'Level-2', 'User-Task', true, 200, count, "Today Task Updated Successfully")
                        }
                    }
                }
            }
        } catch (err: any) {
            response(req, res, activity, 'Level3', 'User-Task', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Users ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }

}

/**
 * @author Mohanraj v
 * @date 06-01-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get completed task
 */
export let getCompletedTask = async (req, res, next,) => {
    try {
        const data = await Users.findById({ _id: req.query._id }, { completeTask: 1 }).populate('completeTask', { appName: 1, description: 1, logo: 1, coinValue: 1 })
        response(req, res, activity, 'Level-1', 'Get-CompletedTask', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'User-Task', false, 500, {}, errorMessage.internalServer, err.message)
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

export let getReferredUser = async (req, res, next) => {
    try {
        // const today = new Date();
        // const day = today.getDate()-5;
        // console.log("day",day);

        const user = await Users.findById({ _id: req.query._id }, { myReferralCode: 1, _id: 0 });
        const data = await Users.find({ referralCode: user?.myReferralCode }, { fullName: 1, profileUrl: 1 });
        response(req, res, activity, 'Level-1', 'Get-ReferedUser', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'User-Task', false, 500, {}, errorMessage.internalServer, err.message)
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
export let getTrendingReferUser = async (req, res, next) => {
    try {
        const data = await Users.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: { referralCode: "$referralCode" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { referralCode: "$_id.referralCode", count: "$count" } },
        ]);
        let trendingList: any = []; 
        // data.forEach(async (result) => //don't delete this
        for (const result of data) {
            if (result?.referralCode !== null && result?.referralCode !== "" && result?.count >= 2) {
                const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { myReferralCode: result.referralCode }] });
                let user = {};
                user["Referral Code:"] = result.referralCode;
                user["Count:"] = result.count;
                user["User Name:"] = userDetails?.fullName;
                user["User ProfileUrl:"] = userDetails?.profileUrl;
                trendingList.push(user)
            }
        };
        console.log(trendingList);
        response(req, res, activity, 'Level-1', 'Get-ReferedUser', true, 200, { trendingList }, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'User-Task', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


/**
 * @author Mohanraj v
 * @date 22-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is working on daily check in
 */


export let dailyCheckIn = async (req, res, next) => {
    try {
        const today = new Date();


        +
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const todayDate = formatDate(today);
        const yesterdayDate = formatDate(yesterday);
        const user = await Users.findById({ _id: req.query._id })
        const td = new Date(todayDate)
        const yd = new Date(yesterdayDate)
        if (user) {
            const company = await Users.findOne({ mobileNumber: mobileNumber }, { todayCheckInAmount: 1, totalCheckInAmount: 1 })
            const todayAmount = company?.todayCheckInAmount;
            const totalAmount = company?.totalCheckInAmount;
            if (user?.checkInDate === td) {
                response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, {}, 'You Already Check In Today');
            }
            else if (user?.checkInDate === yd) {
                const data = await Users.findByIdAndUpdate({ _id: req.query._id }, {
                    $set: { checkInDate: td },
                    $inc: { dateCount: 1, earnings: 10 }
                });
                const comData = await Users.updateOne({ mobileNumber: mobileNumber }, {
                    $inc: { earnings: -10 }
                });
                response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, data, "Today Check In Updated");
            }
            else {
                const data = await Users.findByIdAndUpdate({ _id: req.query._id }, {
                    $set: { checkInDate: td, dateCount: 1 },
                    $inc: { earnings: 10, }
                });
                const comData = await Users.updateOne({ mobileNumber: mobileNumber }, {
                    $inc: { earnings: -10 }
                });
                response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, data, "Today You Start In-Check In Updated");
            }
        } else {
            response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, {}, 'User is Not Found');
        }
        const userData = await Users.findOne({ _id: req.query._id }, { dateCount: 1 })
        if (userData?.dateCount == 7) {
            const data = await Users.findByIdAndUpdate({ _id: req.query._id }, {
                $set: { checkInDate: td, dateCount: 0 },
                $inc: { earnings: 100 }
            });
            const comData = await Users.updateOne({ mobileNumber: mobileNumber }, {
                $inc: { earnings: -100 }
            });
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'User-Check-In', false, 500, {}, errorMessage.internalServer, err.message)

    }
}


/**
 * @author Mohanraj v
 * @date 27-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is working on update tofday checkIn and total checkIn amount give in advin panal
 */

export let updateCheckIn = async (req, res, next) => {
    try {
        const data = await Users.findOneAndUpdate({mobileNumber:mobileNumber }, {
            $set: { todayCheckInAmount: req.body.todayCheckInAmount, totalCheckInAmount: req.body.totalCheckInAmount }
        })
        
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'User-Check-In', false, 500, {}, errorMessage.internalServer, err.message)
    }
}
