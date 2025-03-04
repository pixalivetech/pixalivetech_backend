import { validationResult } from "express-validator"
import { Task, TaskDocument } from "../model/task.model";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail, sendEmailOtp } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { decrypt, encrypt } from "../helper/Encryption";

var activity : 'Task'

export let createUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const taskDetails : TaskDocument = req.body ;
            const user = await Task.findOne({$and:[{email:req.body.email},{isDeleted:false}]})
            if(!user){
                const userotp =   Math.floor(1000 + Math.random() * 9999);
                console.log(userotp);
                taskDetails.otp = userotp ;
                taskDetails.password =await encrypt(taskDetails.password);
                const data = new Task(taskDetails);
                const usersave = await data.save();
                const token = await TokenManager.CreateJWTToken({
                             id:data["_id"],
                             name: data["name"],
                 });
                     let finalResult = {};
                     finalResult["craeteUser"] = 'Sign In';
                     finalResult["userName"] = data.name;
                     finalResult["email"] = data.email;
                     finalResult["token"] = token;
                response(req, res, activity, 'Level-2', 'Create-User', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else{
                response(req,res,activity ,'Level-3','create-user',false,422,{},clientError.email.emailExist)
            }
        } catch (err:any) {
            response(req,res,activity,'Level-3','create-user',false,500,{},errorMessage.internalServer,err.message)
        }
    } else {
        response(req,res,activity,'Level-3','create-user',false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()))
    }
}


export let listSingleUser = async(req,res, next)=>{
 try {
    const user = await Task.findOne({$and:[{_id:req.body._id},{isDeleted:false}]})
    console.log(user);
    if (user) {
        const data = await Task.findOne({_id:req.body._id},{isDeleted:false})
        response(req,res, activity , 'Level-2','get-single-user',true ,200,data , clientError.success.fetchedSuccessfully)
    } else {
        response(req,res,activity,'Level-3','get-single-user',false,422,{},clientError.user.UserNotFound)
    }
     } catch (err:any) {
            response(req,res,activity,'Level-3','get-single-use',false,500,{},errorMessage.internalServer,err.message)
 }
}

export let updateUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const taskDetails :TaskDocument = req.body;
            const user = await Task.findOne({$and:[{_id:req.body._id},{isDeleted:false}]})
            console.log(user);
            if (user) {
                const data = await Task.updateOne({_id:req.body._id},{
                    $set :{
                        email:taskDetails.email,
                        state:taskDetails.state,
                        city:taskDetails.city,
                        modifiedOn: new Date(),
                        modifiedBy:taskDetails.modifiedBy
                    } })
                response(req,res, activity , 'Level-2','update-user',true ,200,data , clientError.success.updateSuccess)
            } else {
                response(req,res,activity,'Level-3','update-user',false,422,{},clientError.user.UserNotFound)
            }
        } catch (err:any) {
            response(req,res,activity,'Level-3','update-user',false,500,{},errorMessage.internalServer,err.message)
        }
    } else {
        response(req,res,activity,'Level-3','update-user',false,422,errorMessage.fieldValidation,JSON.stringify(errors.mapped))
    }
}

export let deleteUser = async(req,res, next)=>{
    try {
        const user = await Task.findOne({$and:[{_id:req.body._id},{isDeleted:false}]})
        console.log(user);
        if (user) {
            const data = await Task.updateOne({_id:req.body._id},{
                $set :{
                    isDeleted:true,
                    modifiedBy:req.body.modifiedBy,
                    modifiedOn: new Date()
                } })
            response(req,res, activity , 'Level-2','delete-user',true ,200,data , clientError.success.deleteSuccess)
        } else {
            response(req,res,activity,'Level-3','delete-user',false,422,{},clientError.user.UserNotFound)
        }
          
} catch (err:any) {
  response(req,res,activity,'Level-3','delete-use',false,500,{},errorMessage.internalServer,err.message)
}
  }
  


