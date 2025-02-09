import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, generate, sendOtp} from "../helper/commonResponseHandler";
import { Master, mastersDocument } from "../model/masterPanel.model";
import { Video, VideoDocument } from "../model/videoAds.model";
import { ShareAds, ShareAdsDocument } from "../model/shareAds.model";
import { InstallAds, InstallAdsDocument } from "../model/installAds.model";
import { Support, SupportDocument } from "../model/support.model";
import { Advertiser, AdvertiserDocument } from "../model/advertiser.model";

var activity ="MasterPanel"

/**
 * @author Haripriyan K
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to add new employee.
 */
export let saveEmployee = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterData = await Master.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!masterData) {
                const masterDetails: mastersDocument = req.body;
                const createData = new Master(masterDetails);
                let insertData = await createData.save();
                response(req, res, activity, 'Level-2', 'Save-Master ', true, 200, insertData, clientError.success.savedSuccessfully);
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Master ', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Master ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Haripriyan K
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all VideoAds.
 */
export let getAllVideoAds = async (req, res, next) => {
    try{
        const data = await Video.find({isDeleted:false},{comment:0})
        response(req,res,activity,'Level-1','GetAll-VideoAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any)  {
        response(req,res,activity,'Level-3','GetAll-VideoAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Haripriyan K
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single VideoAds.
 */
export let getSingleVideoAds = async (req, res, next) => {
    try {
        const data = await Video.find({ $and: [{ _id: req.query._id }, { isDeleted: false }] })
        response(req,res,activity,'Level-2','GetSingle-VideoAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetSingle-VideoAds',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update single VideoAds.
 */
export let updateVideoAds = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const videoDetails:VideoDocument=req.body;
            const updateData = await Video.findByIdAndUpdate({_id:req.body._id},{
                $set:{
                    description:videoDetails.description,
                    landingPageUrl:videoDetails.landingPageUrl,
                    currentStatus:videoDetails.currentStatus,
                    modifiedBy:videoDetails.modifiedBy,
                    modifiedOn:videoDetails.modifiedOn
                }
            })
            response(req,res,activity,'Level-2','Update-VideoAds',true,200,updateData,clientError.success.updateSuccess)
        } catch (error: any) {
            response(req,res,activity,'Level-3','Update-VideoAds',false,500,{},errorMessage.internalServer,error.message)
        }
    } else {
        response(req,res,activity,'Level-3','Update-VideoAds',false,422,{},errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

/**
 * @author Haripriyan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all shareAds.
 */
export let getAllShareAds = async (req, res, next) => {
    try{
        const data = await ShareAds.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-ShareAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any)  {
        response(req,res,activity,'Level-3','GetAll-ShareAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Haripriyan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single shareAds.
 */
export let getSingleShareAds = async (req, res, next) => {
    try {
        const data = await ShareAds.find({ $and: [{ _id: req.query._id }, { isDeleted: false }] })
        response(req,res,activity,'Level-2','GetSingle-ShareAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetSingle-ShareAds',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update shareAds.
 */
export let updateShareAds = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const shareDetails:ShareAdsDocument=req.body;
            const updateData = await ShareAds.findByIdAndUpdate({_id:req.body._id},{
                $set:{
                    advertisementDescription:shareDetails.advertisementDescription,
                    landingPageUrl:shareDetails.landingPageUrl,
                    currentStatus:shareDetails.currentStatus,
                    modifiedBy:shareDetails.modifiedBy,
                    modifiedOn:shareDetails.modifiedOn
                }
            })
            response(req,res,activity,'Level-2','Update-ShareAds',true,200,updateData,clientError.success.updateSuccess)
        } catch (error: any) {
            response(req,res,activity,'Level-3','Update-ShareAds',false,500,{},errorMessage.internalServer,error.message)
        }
    } else {
        response(req,res,activity,'Level-3','Update-ShareAds',false,422,{},errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

/**
 * @author Haripriyan K
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all installAds.
 */
export let getAllInstallAds = async (req, res, next) => {
    try{
        const data = await InstallAds.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-InstallAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any)  {
        response(req,res,activity,'Level-3','GetAll-InstallAds',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single installAds.
 */
export let getSingleInstallAds = async (req, res, next) => {
    try {
        const data = await InstallAds.find({ $and: [{ _id: req.query._id }, { isDeleted: false }] })
        response(req,res,activity,'Level-2','GetSingle-InstallAds',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetSingle-InstallAds',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update installAds.
 */
export let updateInstallAds = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const installDetails:InstallAdsDocument=req.body;
            const updateData = await InstallAds.findByIdAndUpdate({_id:req.body._id},{
                $set:{
                    description:installDetails.description,
                    appUrlLink:installDetails.appUrlLink,
                    currentStatus:installDetails.currentStatus,
                    modifiedBy:installDetails.modifiedBy,
                    modifiedOn:installDetails.modifiedOn
                }
            })
            response(req,res,activity,'Level-2','Update-InstallAds',true,200,updateData,clientError.success.updateSuccess)
        } catch (error: any) {
            response(req,res,activity,'Level-3','Update-InstallAds',false,500,{},errorMessage.internalServer,error.message)
        }
    } else {
        response(req,res,activity,'Level-3','Update-InstallAds',false,422,{},errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all support tickets.
 */
export let getAllTickets = async (req, res, next) => {
    try{
        const data = await Support.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-Tickets',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (err:any)  {
        response(req,res,activity,'Level-3','GetAll-Tickets',false,500,{},errorMessage.internalServer,err.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single support tickets.
 */
export let getSingleTickets = async (req, res, next) => {
    try {
        const data = await Support.find({ $and: [{ _id: req.query._id }, { isDeleted: false }] })
        response(req,res,activity,'Level-2','GetSingle-Tickets',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetSingle-Tickets',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update support tickets.
 */
export let updateTickets = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const ticketDetails:SupportDocument=req.body;
            const updateData = await Support.findByIdAndUpdate({_id:req.body._id},{
                $set:{
                    currentStatus:ticketDetails.currentStatus,
                    modifiedBy:ticketDetails.modifiedBy,
                    modifiedOn:ticketDetails.modifiedOn
                }
            })
            response(req,res,activity,'Level-2','Update-Tickets',true,200,updateData,clientError.success.updateSuccess)
        } catch (error: any) {
            response(req,res,activity,'Level-3','Update-Tickets',false,500,{},errorMessage.internalServer,error.message)
        }
    } else {
        response(req,res,activity,'Level-3','Update-Tickets',false,422,{},errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all advertiser.
 */
export let getAllAdvertiser = async (req, res, next) => {
    try {
        const data = await Advertiser.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-Advertiser',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetAll-Advertiser',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single advertiser.
 */
export let getSingleAdvertiser = async (req, res, next) => {
    try {
        const data = await Advertiser.find({ $and: [{ _id: req.query._id }, { isDeleted: false }] })
        response(req,res,activity,'Level-2','GetSingle-Advertiser',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetSingle-Advertiser',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all employee.
 */
export let getAllEmployee = async (req, res, next) => {
    try {
        const data = await Master.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-Employee',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetAll-Employee',false,500,{},errorMessage.internalServer,error.message)
    }
}

/**
 * @author Haripriyan K
 * @date 16-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single employee.
 */
export let getSingleEmployee = async (req, res, next) => {
    try {
        const data = await Master.find({ $and: [{ _id: req.query._id }, { isDeleted: false }] })
        response(req,res,activity,'Level-2','GetSingle-Employee',true,200,data,clientError.success.fetchedSuccessfully)
    } catch (error: any) {
        response(req,res,activity,'Level-3','GetSingle-Employee',false,500,{},errorMessage.internalServer,error.message)
    }
}