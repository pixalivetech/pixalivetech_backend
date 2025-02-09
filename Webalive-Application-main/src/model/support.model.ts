import mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

export interface SupportDocument extends mongoose.Document {
  _id?:any;
  ticketId?:any,
  userId?:any,
  advertiserId?:any,
  name?: string;
  email?: string;
  phoneNo?: string;
  subject?: string;
  description?: string;
  issue?: string;
  currentStatus?: string;
  status?: number;
 isDeleted?:boolean;
 modifiedOn?: Date;
 modifiedBy?: string;
 createdOn?: Date;
 createdBy?: string;

 
}

const supportRequestSchema = new mongoose.Schema({
  _id: {type:mongoose.Types.ObjectId,required: true,auto:true},
  ticketId:{type:Number},
  userId:{type:mongoose.Types.ObjectId,ref:'Users'},
  advertiserId:{type:mongoose.Types.ObjectId,ref:'Advertiser'},
  name: {type: String},
  email: {type: String},
  phoneNo: {type: String},
  subject: {type: String,required: true},
  description: {type: String,required: true},
  currentStatus: { type: String, default: "" },
  status: { type: Number, default: 1 },
  isDeleted:{type:Boolean,default:false},
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
  createdOn: { type: Date },
  createdBy: { type: String },
  
});
supportRequestSchema.plugin(autoIncrement, {
  model: 'Support',
  field: 'ticketId',
  startAt: 1,
  incrementBy: 1
});
 

export const Support = mongoose.model('Support',supportRequestSchema);
