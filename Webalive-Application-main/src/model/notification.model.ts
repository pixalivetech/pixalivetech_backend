import mongoose from 'mongoose';

export interface NotificationDocument extends mongoose.Document {
  advertiserId: String;
  masterId: String;
  title: String;
  description:String;
  data:String;
  isDeleted?:Boolean,
    status?:Number,
    createdOn?:Date,
    createdBy?:String,
    modifiedOn?:Date,
    modifiedBy?:String
}

const notificationSchema = new mongoose.Schema({
  advertiserId: { type: String, default: ''},
  masterId: {type: String,default: ''},
  title: { type: String},
  description: {type: String},
  data: { type: String},
  isDeleted:{type:Boolean,default:false},
  status:{type:Number,default:1},
  createdOn:{type:Date,default:Date.now},
  createdBy:{type:String,default:""},
  modifiedOn:{type:Date,default:Date.now},
  modifiedBy:{type:String,default:""},
  
});


export let Notification = mongoose.model("Notification",notificationSchema);
