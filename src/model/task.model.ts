import * as mongoose from 'mongoose';

export interface  TaskDocument extends mongoose.Document {
    _id?;any;
    name?:string;
    email?:string;
    city?:string;
    state?:string;
    password?:string;
    country?:string;
    otp?:number;
    isDeleted?:boolean;
    status?:number;
    createdBy?:string;
    createdOn?:Date;
    modifiedOn?:Date;
    modifiedBy?:string;
}

const taskSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
  name:{type:String},
  email:{type:String , lowercase: true},
  password:{type:String},
  city:{type:String},
  state:{type:String},
  country:{type:String},
  otp:{type:Number},
  isDeleted:{type:Boolean, default:false},
  status:{type:Number, default:1},
  createdBy:{type:String, default:"Kaaviyan"},
  createdOn:{type:Date, default:Date.now},
  modifiedBy:{type:String},
  modifiedOn:{type:Date}
})

export const Task = mongoose.model('user',taskSchema);