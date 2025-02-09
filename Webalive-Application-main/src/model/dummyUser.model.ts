import mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

export interface DummyDocument extends mongoose.Document {
    _id?: any;
    fullName?: string;
    userName?: string;
    userId?:number,
    email?: string;
    mobileNumber?: number;
    profileUrl?: string;
    registrationDate?: string;
    dateOfBirth?: string;
    gender?: string;
    accountInfo?: string;
    bio?: string;
    fcm_Token?: string;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
}

const dummySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    fullName: { type: String,required:true},
    userName: { type: String },
    userId:{type:Number},
    email: { type: String, unique:true, required:true },
    mobileNumber: { type: Number },
    profileUrl: { type: String, default: 'https://s3.ap-south-1.amazonaws.com/pixalive.me/empty_profile.png' },
    registrationDate: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String },
    accountInfo: { type: String },
    bio: { type: String },
    fcm_Token:{type:String}, 
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
});



dummySchema.plugin(autoIncrement, {
    model: 'DummyUser',
    field: 'userId',
    startAt: 1,
    incrementBy: 1
  });

export const Dummy = mongoose.model('DummyUser', dummySchema);