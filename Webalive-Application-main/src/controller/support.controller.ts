import { Support,SupportDocument } from "../model/support.model";
import {response}from "../helper/commonResponseHandler";
import { errorMessage,clientError } from "../helper/ErrorMessage";
import { validationResult } from "express-validator";
import { Users } from "src/model/users.model";

var activity = "Support";

/**
 * @author Balaji Murahari
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function use support
 * 
  * */
export let supportpost = async (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const supportData:SupportDocument = req.body;
           
            const createData = new Support(supportData);
            let insertData = await createData.save();
            response(req,res,activity,'Level-2','Support-post',true,200,insertData,clientError.success.savedSuccessfully);
        }
        catch (err:any) {
        response(req,res,activity,'Level-3','Support-Post',false,500,{},errorMessage.internalServer,err.message);
        }
    }
    else 
    {
        response(req, res, activity, 'Support-Post', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


/**
 * @author Balaji Murahari
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all tickets.
 */
export let getAllTickets = async (req,res,next)=>{
    try{
        const showticket = await Support.find();
        response(req, res, activity,'Level-1','GetAll-Tickets', true, 200, showticket, clientError.success.fetchedSuccessfully) 
    }
    catch (err:any){
        response(req, res, activity,'Level-3','GetAll-Tickets', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



/**
 * @author Balaji Murahari
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all singletickets.
 */ 

export let getSingleTickets = async (req,res,next) =>{
    try{
        const ticketData = await Support.findOne({$and:[{_id:req.query._id},{isDeleted:false}]});
        response(req, res, activity, 'Level-2', 'Get-SingleTickets', true, 200, ticketData, clientError.success.fetchedSuccessfully);
    }
    catch (err:any){
        response(req, res, activity, 'Level-3', 'Get-SingleTickets', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Haripriyan K
 * @date 25-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get a specific advertiser tickets.
 */ 
export let getAdvertiserTickets = async (req,res,next) =>{
    try{
        const Data = await Support.find({$and:[{advertiserId:req.query._id},{isDeleted:false}]});
        response(req, res, activity, 'Level-2', 'Get-AdvertiserTickets', true, 200, Data, clientError.success.fetchedSuccessfully);
    }
    catch (err:any){
        response(req, res, activity, 'Level-3', 'Get-AdvertiserTickets', false, 500, {}, errorMessage.internalServer, err.message);
    }
}