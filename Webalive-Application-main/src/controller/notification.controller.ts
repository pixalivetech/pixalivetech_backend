import {validationResult} from "express-validator";
import { clientError,errorMessage } from "../helper/ErrorMessage";
import { response} from "../helper/commonResponseHandler";
import { Users } from "../model/users.model";
import { Advertiser} from "../model/advertiser.model"
import  axios from "axios";
import { Notification,NotificationDocument } from "../model/notification.model";

var activity = "Notification";

/**
 * @author Balaji Murahari / Haripriyan K 
 * @date 12-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is use to send notification
 */
export let manualNotificationMultiple = async (req,res)=>{
    try {
      const {advertiserId,masterId,Title,Description,Data}=req.body;
      const user = await Users.find({},{fcm_Token:1,_id:0});
      const fcmToken = user[0].fcm_Token;
      const notes= await sendNotificationMultiple(fcmToken,advertiserId,masterId,Title,Description,Data) 
      res.status(200).json({notes}) 

    }catch(error:any){
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async function sendNotificationMultiple(fcmToken, advertiserId, masterId, Title, Description, Data) {
    //const userList = await User.findById({_id:userId})
    //var fcmToken = [];
    //fcmToken.push(userList.fcm_token)
    var Authorization = "key=AAAAZJewEmk:APA91bEOFcitLKiSLeDkaa421teDO1RxPyEPt3M8Y9IayrlE6s4wWqnnB7pAqARnn-giHWnkrkx_I-Ijv1oLBwj0-tElTAPCE9OyLWdjL9EY97Q9AkVT2E99SIhfgARgE6abB513G41G";
    const sentmessage = {
      "registration_ids": fcmToken,
      notification: { title: Title, body: Description, data: Data }
    }
      try {
           const responce = await axios.post('https://fcm.googleapis.com/fcm/send', sentmessage, {
            headers: {
              'Authorization': Authorization,
              "Content-Type": "application/json"
            }
          })
            const value=responce.data
            //console.log(value);
              if(value){
                await userSaveNotification(fcmToken,Title,Description,Data)
            // save notification for master and advertiser
                if(masterId){
                  console.log("master send notification");
                  const tell=await saveNotification("",masterId,Title,Description,Data)
                  return tell
                }
                else if(advertiserId){
                  console.log("advertiser send notification");
                  const set= await saveNotification(advertiserId,"",Title,Description,Data)
                  return set
                }
              }else{
                console.log("notification not send");
              }
      } catch (error) {
           console.error(error)
      }
      // .then(doc => {
      //   console.log('dd', doc.data);
  
      //   return doc.data;
      // })
      // .catch(error => {
      //   console.error(error)
      // })
}

async function userSaveNotification(fcmToken,Title,Description,Data){
    try{
        const user =await Users.findOne({$and:[{fcm_Token:fcmToken},{isDeleted:false}]})
        const advertiser =await Advertiser.findOne({$and:[{fcm_Token:fcmToken},{isDeleted:false}]})
      if(user){        
        const post = await Users.findByIdAndUpdate({_id:user._id},{$push:{notification:{
            title:Title,
            description:Description,
            data:Data}}});
        }else if(advertiser){         
          const post = await Advertiser.findByIdAndUpdate({_id:advertiser._id},{$push:{notification:{
            title:Title,
            description:Description,
            data:Data}}});            
        }
        else{
          console.log("fcm token not found"); 
        }
    }catch(err){
        console.log(err);
    }
}

async function saveNotification(advertiser,master,Title,Description,Data){
    try{
      console.log("value is recived");
      const advertiserId=advertiser;
      const masterId=master;
      const data=Data;
      const description=Description
      const title=Title
      const send= await Notification.create({advertiserId,masterId,data,description,title})
      if(send){
        console.log("Notification saved");
      }
        return send;
    }catch(err){
        console.log(err);
    }  
}

export async function sendNotificationSingle(fcmToken,Title,Description,Data) {
  var Authorization = "key=AAAAZJewEmk:APA91bEOFcitLKiSLeDkaa421teDO1RxPyEPt3M8Y9IayrlE6s4wWqnnB7pAqARnn-giHWnkrkx_I-Ijv1oLBwj0-tElTAPCE9OyLWdjL9EY97Q9AkVT2E99SIhfgARgE6abB513G41G";
  const sentmessage = {
    "registration_ids":[fcmToken],
    notification: { title: Title, body:Data}
  }
  try{
  
   const responce=await axios.post('https://fcm.googleapis.com/fcm/send', sentmessage, {
                      headers: {
                        'Authorization': Authorization,
                        "Content-Type": "application/json" } })
                
                        const value=responce.data
                  if(value){
                  await userSaveNotification(fcmToken,Title,Description,Data)
                  }else{
                    console.log("notification not send");
                  }
              
                // return responce.data;
  }
    catch(error){
      console.error(error)
    }
}