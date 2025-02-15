import mongoose from "mongoose";

export interface OurClientsDocument extends mongoose.Document{
    _id?:any;
    adminId?:any;
    name?:String;
    logo?:String;
    status?:Number;
    isDeleted?:Boolean;
    createdOn?:Date;
    createdBy?:String;
    modifiedOn?:Date;
    modifiedBy?:String;

}

const OurClientsSchema= new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,required:true,auto:true},
    adminId:{type:mongoose.Types.ObjectId,ref:"AdminPanel"},
    name:{type:String},
    logo:{type:String},
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},
})
export const OurClients= mongoose.model("OurClient",OurClientsSchema);