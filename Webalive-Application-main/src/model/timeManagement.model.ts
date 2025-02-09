import  mongoose  from "mongoose";

export interface TimeManagementDocument extends mongoose.Document{
    _id?:any;
    userId?:any;
    date?:String;
    clickCount?:Number;
    createdOn?:Date;
 }
const schema= new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    userId:{type:mongoose.Types.ObjectId,ref:'Users'},
    date:{type:String,},
    clickCount:{type:Number,default:0},
    createdOn:{type:Date,default:Date.now()},
});

export const TimeManagement= mongoose.model('TimeManagement',schema)