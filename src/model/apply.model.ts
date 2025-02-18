import mongoose from "mongoose";

export interface ApplyDocument extends mongoose.Document{
    _id?:any;
    title?:String;
    name?:String;
    email?:String;
    mobileNumber?:Number;
    resume?:String;
    status?:Number;
    isDeleted?:Boolean;
    createdOn?:Date;
    createdBy?:String;
    modifiedOn?:Date;
    modifiedBy?:String;

}

const ApplySchema= new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    title:{type:String},
    name:{type:String},
    email:{type:String},
    mobileNumber:{type:Number},
    resume:{type:String},
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},
})
export const Apply= mongoose.model("Apply",ApplySchema);