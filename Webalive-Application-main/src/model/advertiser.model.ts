import  mongoose  from "mongoose";
import { autoIncrement } from 'mongoose-plugin-autoinc';

export interface AdvertiserDocument extends mongoose.Document{
                _id?:any;
                email?:string;
                name?:string;
                gender?:string;
                address?:string;
                Dob?:Date;
                userName?:string;
                coinValue:number;
                password?:string;
                companyName?:string;
                profileUrl?:string;
                otp?:number;
                postCount?:number;
                taskCount?:number;
                brandProfileUrl?:string;
                advertiserCategory?:string;
                billingAddress?:string;
                appPackageUrl?:string;
                mobileNumber?:number;
                advertiserId?:number;
                referralCode?:string;
                myReferralCode?:string;
                referredDetails?:any[];
                fcm_Token?:string;
                referredBy?:string;
                referredOn?:Date;
                gmailOtp?:Number;
                isActive?:boolean;
                isDeleted?:boolean;
                status?:number;
                createdOn?:Date;
                createdBy?:string;
                modifiedOn?:Date;
                modifiedBy?:string
      };
const advertiserSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    email:{type:String,required:true,},
    name:{type:String,required:true},
    gender:{type:String},
    address:{type:String},
    dob:{type:Date},
    userName:{type:String,},
    coinValue:{type:Number},
    password:{type:String,required:true},
    companyName:{type:String,},
    profileUrl:{type:String,default: 'https://s3.ap-south-1.amazonaws.com/pixalive.me/empty_profile.png'},
    otp:{type:Number},
    postCount:{type:Number,default:0},
    taskCount:{type:Number,default:0},
    completeTaskOnUser:{type:Number,default:0},
    brandProfileUrl:{type:String},
    advertiserCategory:{type:String},
    billingAddress:{type:String},
    appPackageUrl:{type:String},
    mobileNumber:{type:Number},
    advertiserId:{type:Number},
    referralCode:{type:String},
    myReferralCode:{type:String},
    referredDetails:{
        email:{type:String},
        createdOn:{type:Date,default:Date.now}
    },
    followers:[{type:mongoose.Types.ObjectId,ref:'Users'}],
    followersCount:{type:Number,default:0},
    fcm_Token:{type:String},
    gmailOtp:{type:Number},
    notification:[{
        title:{ type: String },
        description:{ type: String }, 
        data:{ type: String }, 
        createdOn:{type:Date,default:Date.now}
    }],
    isActive:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false},
    status:{type:Number,default:1},
    createdOn:{type:Date},
    createdBy:{type:String},
    modifiedOn:{type:Date},
    modifiedBy:{type:String}
});

advertiserSchema.plugin(autoIncrement, {
    model: 'Advertiser',
    field: 'userId',
    startAt: 1,
    incrementBy:1
});


export const Advertiser=mongoose.model("Advertiser",advertiserSchema)