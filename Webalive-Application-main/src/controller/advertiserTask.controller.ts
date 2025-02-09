import { AdvertiserTask,AvertiserTaskDocument } from "../model/advertiserTask.model";
import {response,formatDate  } from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";
import { query, validationResult} from "express-validator";
import { Advertiser } from "../model/advertiser.model";
import { toNamespacedPath } from "path";
import { Users } from "../model/users.model";

var activity= "AdvertiserTask";
var mobileNumber = 9988776655;

/**
 * @author Mohanraj
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get save the advertiser task details.
 */

export let saveAdvertiserTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const  advertiser = await Advertiser.findById({_id:req.body.advertiserId});
            if(!advertiser)
            {
                 return response(req, res, activity, 'Level-3', 'Save-AdvertiserTask', false, 422, {}, errorMessage.fieldValidation, "Advertiser Id not found");
            }else{
                
                 const advertiserTaskDetails: AvertiserTaskDocument = req.body;
                if ((advertiser?.coinValue !== 0) && ( advertiserTaskDetails?.coinValue !== 0)) {
                    const advertiserTaskData = new AdvertiserTask(advertiserTaskDetails);
                    let insertAdvertiserTask = await advertiserTaskData.save();
                    if (insertAdvertiserTask?.advertiserId) {
                        const adver = await Advertiser.findByIdAndUpdate({_id:insertAdvertiserTask.advertiserId},{$inc:{coinValue:-insertAdvertiserTask.coinValue}})   
                    }
                    if(insertAdvertiserTask?.coinValue){ //split the coin value on task to the advertisertask
                        const split =insertAdvertiserTask?.coinValue/insertAdvertiserTask?.splitUser;
                        const value=Math.floor(split);
                        const user = await AdvertiserTask.findByIdAndUpdate({_id:insertAdvertiserTask?._id},{$set:{userShare:value}})
                    }//update the taskcount on advertiser task count
                    const advertiser = await Advertiser.findByIdAndUpdate({_id:insertAdvertiserTask?.advertiserId},{$inc:{taskCount:1}})
                    response(req, res, activity, 'Level-1', 'Save-AdvertiserTask', true, 200, insertAdvertiserTask, clientError.success.savedSuccessfully);
                }else{
                    response(req, res, activity, 'Level-3', 'Save-AdvertiserTask', false, 422, {}, "Insufficient Coin On Advertiser");
                } 
            }
            }catch (err: any) {
                    response(req, res, activity, 'Level-3', 'Save-AdvertiserTask', false, 500, {}, errorMessage.internalServer, err.message);
                }
            } else {
                response(req, res, activity, 'Level-3', 'Save-AdvertiserTask', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
            }
        };


/**
 * @author Mohanraj
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get save the advertiser task details.
 */

export let getAllAdvertiserTask = async (req, res, next) => {
    try {
        const user= await Users.findOne({_id:req.query._id},{completeTask:1,_id:0});    
        const advertiserTaskData = await AdvertiserTask.find({$and:[{isDeleted:false},{_id:{$nin:user?.completeTask}}]});
        response(req, res, activity, 'Level-2', 'Get-AdvertiserTask', true, 200, advertiserTaskData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-AdvertiserTask', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Mohanraj
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get update the advertiser task details.
 */

export let updateAdvertiserTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const advertiserTaskDetails: AvertiserTaskDocument = req.body;
            const updateTask = new AdvertiserTask(advertiserTaskDetails);
            const updateAdvertiserTask = await updateTask.updateOne( {
                    $set:{
                        appName:advertiserTaskDetails.appName,
                        description:advertiserTaskDetails.description,
                        steps:advertiserTaskDetails.steps,
                        logo:advertiserTaskDetails.logo,
                        coinValue:advertiserTaskDetails.coinValue,
                        modifiedOn: new Date(),
                        modifiedBy:advertiserTaskDetails.modifiedBy

                    }
                }, { new: true });
                const data = await AdvertiserTask.findById({_id:updateAdvertiserTask?._id})
            response(req, res, activity, 'Level-1', 'Update-AdvertiserTask', true, 200, data, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-AdvertiserTask', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-AdvertiserTask', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Mohanraj
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get save the advertiser task details.
 */

export let deleteAdvertiserTask = async (req, res, next) => {
    try {
        const updateAdvertiserTask = await AdvertiserTask.findByIdAndUpdate({_id:req.query._id} ,
            {$set:{
                isDeleted:true,
                modifiedOn: new Date(),
                modifiedBy:req.body.modifiedBy
            },
        },{ new: true });
        const advertiser = await Advertiser.findByIdAndUpdate({_id:updateAdvertiserTask?.advertiserId},{$inc:{taskCount:1}})
        response(req, res, activity, 'Level-1', 'Delete-AdvertiserTask', true, 200, updateAdvertiserTask, clientError.success.deleteSuccess);
        
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Delete-AdvertiserTask', false, 500, {}, errorMessage.internalServer, err.message);
        
    }

};

/**
 * @author Mohanraj
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single task details.
 */

export let getSingleAdvertiserTask = async (req, res, next) => {
    try {
        const advertiserTaskData = await AdvertiserTask.find({ advertiserId: req.query._id });
        console.log(advertiserTaskData);
        
        response(req, res, activity, 'Level-1', 'Get-SingleAdvertiserTask', true, 200, advertiserTaskData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleAdvertiserTask', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Mohanraj
 * @date 3-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update user for task completion reference.
 */

// export let updateTaskOnUser = async (req, res, next) => {
//     try {     
        
//         const today = new Date();
//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);
//         const todayDate = formatDate(today);
//         const yesterdayDate = formatDate(yesterday);
        
//         //updatet the user task completion on task field
//         const updateTask = await AdvertiserTask.findByIdAndUpdate({ _id: req.body._id }, {
//             $push:{validation:{
//                 userId: req.body.userId,
//                 mobileNumber: req.body.mobileNumber,
//                 name:req.body.name,
//                 screenShot:req.body.screenShot
//             }},
//             $inc:{splitUser:-1}
//         });
//         const checkTask = await AdvertiserTask.findById({_id:req.body._id})
//         if(checkTask?.splitUser == 0) //if split count is zero then the task was hide to the all users 
//         {
//             const taskUpdate = await AdvertiserTask.findByIdAndUpdate({ _id: req.body._id }, {
//                 $set:{
//                     coinValue:0,
//                     userShare:0,
//                     isDeleted:true,
//                     taskBalence:true,
//                 }
//             })
//         }
//         if(updateTask)//if user update the task to store the id of user completion task and earning the task completed amount
//         {
//          await Users.findOneAndUpdate({ _id: req.body.userId }, 
//             {
//                 $push: {completeTask: req.body._id},
//                 $inc:{completedTaskCount:1,earnings:updateTask?.userShare/2},
//                 $set:{taskDate:todayDate}
//             });
//             const user = await Users.findById({ _id: req.query.userId })
//             const td = new Date(todayDate)
//             const yd = new Date(yesterdayDate)
//             if (user) {             
//                  if (user?.checkInDate == yd) {
//                     const data = await Users.findByIdAndUpdate({ _id: req.query._id }, {
//                         $set: { checkInDate: todayDate },
//                         $inc: { dateCount: 1, earnings: 10 }
//                     });
//                     const comData = await Users.updateOne({ mobileNumber: mobileNumber }, {
//                         $inc: { earnings: -10 }
//                     });
//                     response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, data, "Today Check In Updated");
//                 }
//                 else {
//                     const data = await Users.findByIdAndUpdate({ _id: req.query._id }, {
//                         $set: { checkInDate: td, dateCount: 1 },
//                         $inc: { earnings: 10, }
//                     });
//                     const comData = await Users.updateOne({ mobileNumber: mobileNumber }, {
//                         $inc: { earnings: -10 }
//                     });
//                     response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, data, "Today You Start In-Check In Updated");
//                 }
//             } else {
//                 response(req, res, activity, 'Level-3', 'User-Check-In', true, 200, {}, 'User is Not Found');
//             }
//             const userData = await Users.findOne({ _id: req.query._id }, { dateCount: 1 })
//             if (userData?.dateCount == 10) {
//                 const data = await Users.findByIdAndUpdate({ _id: req.query._id }, {
//                     $set: { checkInDate: td, dateCount: 1 },
//                     $inc: { earnings: 100 }
//                 });
//                 const comData = await Users.updateOne({ mobileNumber: mobileNumber }, {
//                     $inc: { earnings: -100 }
//                 });
//             }       
        
//         }
//         const advertiser = await Advertiser.findByIdAndUpdate({_id:updateTask?.advertiserId},{$inc:{completeTaskOnUser:1}})
//         response(req, res, activity, 'Level-1', 'Update-TaskOnUser', true, 200, updateTask, clientError.success.updateSuccess);
//     }catch(err: any) {
//             response(req, res, activity, 'Level-3', 'Update-TaskOnUser', false, 500, {}, errorMessage.internalServer, err.message);
//         }
// }
