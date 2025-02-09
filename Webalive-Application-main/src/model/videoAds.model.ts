import mongoose from 'mongoose';


export interface VideoDocument extends mongoose.Document{
    _id?:any,
    advertiserId?:string,
    video?:string,
    title?:string,
    description?:string,
    landingPageUrl?:string,
    likeCount?:number,
    likedUser?:any[],
    comment?:string[],
    commentCount?:number,
    allocatedAmount?:number,
    amountPerView?:number,
    currentStatus?:string,
    isDeleted?:boolean,
    status?:number,
    createdOn?:Date,
    createdBy?:string,
    modifiedOn?:Date,
    modifiedBy?:string
}

const videoSchema = new mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,required:true,auto:true},
    advertiserId:{type:mongoose.Types.ObjectId,ref:"Advertiser"},
    video:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    landingPageUrl:{type:String,required:true},
    likeCount:{type:Number,default:0},
    likedUser:[{type:mongoose.Types.ObjectId,ref:"Users"}],
    comment:[{ userName:{type:String},
               comment:{type:String},
               profileUrl:{type:String},
               commentDate:{type:Date,default:Date.now} }],
    commentCount:{type:Number,default:0},
    allocatedAmount:{type:Number,default:0},
    amountPerView:{type:Number,default:0},
    currentStatus:{type:String,default:""},
    isDeleted:{type:Boolean,default:false},
    status:{type:Number,default:1},
    createdOn:{type:Date,default:Date.now},
    createdBy:{type:String,default:""},
    modifiedOn:{type:Date,default:Date.now},
    modifiedBy:{type:String,default:""},
})

export let  Video=mongoose.model("VideoAds",videoSchema);