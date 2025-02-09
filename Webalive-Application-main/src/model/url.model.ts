import mongoose from "mongoose";

export interface UrlDocument extends mongoose.Document{
    _id?:string;
    advertiserId?:any;
    userName?:string;
    profileUrl?:string;
    url?:string;
    clickCount?:number;
    indianUsers?:number;
    otherUsers?:number;
    maleGender?:number;
    femaleGender?:number;
    likeCount?:number;
    coinValue?:number;
    likeAmount?:number;
    clickAmount?:number;
    coin?:boolean;
    likedUser?:any[];
    clickUser?:any[];
    title?:string;
    commentsCount?:number;
    comment?:any[];
    description?:string;
    category?:string;
    postDate?:Date;
    fileType?:string;
    reports?:any[];
    status?:number;
    isDeleted?:boolean;
    createdOn?:Date;
    createdBy?:string;
    modifiedOn?:Date;
    modifiedBy?:string;
    
}

const urlSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    advertiserId:{type:mongoose.Types.ObjectId,ref:'Advertiser'},
    userName:{type:String},
    profileUrl: { type: String, default: 'https://s3.ap-south-1.amazonaws.com/pixalive.me/empty_profile.png' },
    url:{type:String,required:true},
    clickCount:{ type: Number, default:0},
    indianUsers:{type:Number,default:0},
    otherUsers:{type:Number,default:0},
    maleGender:{type:Number,default:0},
    femaleGender:{type:Number,default:0},
    likeCount:{type:Number,default:0},
    coinValue:{type:Number,default:0},
    likeAmount:{type:Number,default:0},
    clickAmount:{type:Number,default:0},
    coin:{type:Boolean,default:false},
    likedUser:[{type:mongoose.Types.ObjectId,ref:'Users'}],
    clickUser:[{type:mongoose.Types.ObjectId,ref:'Users'}],
    comment:[{     profileUrl:{type:String},
                    userName:{type:String},
                    comment:{type:String},
                    commentDate:{type:Date,default:Date.now} }],
    title:{type:String},
    commentsCount:{type:Number,default:0},
    description:{type:String},
    category:{type:String},
    postDate:{type:Date},
    fileType:{type:String},
    reports:[{
            reason:{type:String,default:""},
            createOn:{type:Date,default:Date.now}
    }],
    reportCount:{type:Number,default:0},
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},

})

export const Url = mongoose.model('Url',urlSchema)