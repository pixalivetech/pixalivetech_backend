import mongoose from "mongoose";

export interface ContactDocument extends mongoose.Document{
    _id?:any;
    name?:String;
    email?:String;
    mobileNumber?:Number;
    subject?:String;
    message?:String;
    status?:Number;
    isDeleted?:Boolean;
    createdOn?:Date;
    createdBy?:String;
    modifiedOn?:Date;
    modifiedBy?:String;

}

const ContactSchema= new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    name:{type:String},
    email:{type:String},
    mobileNumber:{type:Number},
    subject:{type:String},
    message:{type:String},
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},
})
export const Contact= mongoose.model("Contact",ContactSchema);