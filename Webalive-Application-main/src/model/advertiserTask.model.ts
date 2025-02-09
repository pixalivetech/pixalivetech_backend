import  mongoose  from "mongoose";
import { Advertiser } from "./advertiser.model";


export interface AvertiserTaskDocument extends mongoose.Document
{
    _id?:any,
    advertiserId?:any,
    appName?:String,
    description?:String,
    steps?:any,
    logo?:String,
    coinValue?:Number,
    splitUser?:Number,
    userShare?:Number,
    taskBalence?:Boolean,
    appUrl?:String,
    webSiteUrl?:String,
    status?:Number,
    isDeleted?:boolean,
    createdOn?:Date,
    createdBy?:String,
    modifiedOn?:Date,
    modifiedBy?:String
}




const AdvertiserTaskSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    advertiserId:{type:mongoose.Types.ObjectId,ref:'Advertiser'},
    appName: {type: String,required: true},
    description: {type: String},
    steps:{
        step1:{type:String},
        step2:{type:String},
        step3:{type:String},
    },
    logo:{type:String},
    coinValue:{type:Number,default:0},
    splitUser:{type:Number,default:0},
    userShare:{type:Number,default:0},
    taskBalence:{type:Boolean,default:false},
    validation:[{
        userId:{type:mongoose.Types.ObjectId,ref:'Users'},
        mobileNumber:{type:Number},
        name:{type:String},
        screenShot:{type:String},
        createdOn:{type:Date,default:Date.now},
    }],
    webSiteUrl:{type:String},
    appUrl:{type:String},
    status: { type: Number, default: 1 },
    isDeleted:{type:Boolean,default:false},
    createdOn: { type: Date },
    createdBy:{type:String},
    modifiedOn:{type:Date},
    modifiedBy:{type:String}
})


export const AdvertiserTask = mongoose.model('AdvertiserTask',AdvertiserTaskSchema);