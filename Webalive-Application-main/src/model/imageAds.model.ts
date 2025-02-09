import mongoose from 'mongoose';


export interface ImageDocument extends mongoose.Document{
    _id?:any,
    advertiserId?:string,
    image?:string,
    title?:string,
    description?:string,
    landingPageUrl?:string,
    likeCount?:number,
    likedUser?:any,
    comment?:string[],
    commentCount?:number,
    allocatedAmount:number,
    amountPerView: number,
    isDeleted?:boolean,
    status?:number,
    createdOn?:Date,
    createdBy?:string,
    modifiedOn?:Date,
    modifiedBy?:string
}

const imageSchema = new mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,required:true,auto:true},
    advertiserId:{type:mongoose.Schema.Types.ObjectId,ref:"Advertiser"},
    image:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    landingPageUrl:{type:String,required:true},
    likeCount:{type:Number,default:0},
    likedUser:[{type:mongoose.Types.ObjectId,ref:'Users'}],
    comment:[{ userName:{type:String},
               comment:{type:String},
               profileUrl:{type:String},
               commentDate:{type:Date,default:Date.now} }],
    commentCount:{type:Number},
    allocatedAmount:{type:Number},
    amountPerView:{type:Number,default:0},
    isDeleted:{type:Boolean,default:false},
    status:{type:Number,default:1},
    createdOn:{type:Date,default:Date.now},
    createdBy:{type:String,default:""},
    modifiedOn:{type:Date,default:Date.now},
    modifiedBy:{type:String,default:""},
})

export let  Image=mongoose.model("ImageAds",imageSchema);