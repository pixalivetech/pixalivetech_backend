import mongoose from 'mongoose';
import { getCompletedTask } from 'src/controller/users.controller';
import multer from "multer";

export interface UsersDocument extends mongoose.Document {
    _id?: any;
    fullName?: String;
    userName?: String;
    mobileNumber?: Number;
    country?: Number;
    dob?: String;
    gender?: Number;
    address?: String;
    email?: String;
    profileUrl?: String;
    isDeleted?: Boolean;
    referralCode?: String;
    myReferralCode?: String;
    otp?: Number;
    planActivation?: Boolean;
    plan?: Number;
    fcm_Token?: String;
    followers?: any[];
    followersCount?: Number;
    bankDetails?: any;
    paytm?: string,
    upi?: string,
    postCount?: Number,
    viewCount?: Number,
    oldTaskId?: any,
    urlClickCount?: Number,
    totalClickCount?: Number,
    todayClickCount?: Number,
    allLikesCount?: Number,
    savedPost?: any[];
    rewards?: Number,
    earnings?: Number,
    blockedUsers?: any[],
    Notification: any[],
    checkInDate?: String,
    dateCount?: number;
    todayCheckInAmount?: Number;
    totalCheckInAmount?: Number;
    status?: Number;
    modifiedOn?: Date;
    modifiedBy?: String;
    createdOn?: Date;
    createdBy?: String;

};

const usersSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    fullName: { type: String, },
    userName: { type: String },
    email: { type: String, },
    mobileNumber: { type: Number, },
    country: { type: Number },
    dob: { type: String },
    gender: { type: Number },
    address: { type: String },
    profileUrl: { type: String, default: 'https://s3.ap-south-1.amazonaws.com/pixalive.me/empty_profile.png' },
    referralCode: { type: String },
    myReferralCode: { type: String },
    otp: { type: Number },
    planActivation: { type: Boolean, default: false },
    plan: { type: Number, default: 0 },  // 1 - Basic, 2 - Standard, 3 - Premium
    planActivationDayCount: { type: Number },
    planActiveMonths: {
        Date: { type: Date },
        plan: { type: Number }
    },
    fcm_Token: { type: String },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
    followersCount: { type: Number, default: 0 },
    bankDetails: {
        bankAccountNumber: { type: Number, },
        ifscCode: { type: String, },
        accountHolderName: { type: String, },
        mobileNumber: { type: Number, },
    },
    paytm: { type: String, },
    upi: { type: String, },
    postCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    oldTaskId: { type: mongoose.Types.ObjectId, ref: "TimeManagement" },
    urlClickCount: { type: Number, default: 0 },
    totalClickCount: { type: Number, default: 0 },
    todayClickCount: { type: Number, default: 0 },
    allLikesCount: { type: Number, default: 0 },
    savedPost: [{ type: mongoose.Types.ObjectId, ref: 'Url' }],
    rewards: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    blockedUsers: [{ type: mongoose.Types.ObjectId, ref: 'Advertiser' }],
    isDeleted: { type: Boolean, default: false },
    signIn: { type: Boolean, default: false },
    completeTask: [{ type: mongoose.Types.ObjectId, ref: 'AdvertiserTask' }],
    completedTaskCount: { type: Number, default: 0 },
    notification: [{
        title: { type: String },
        description: { type: String },
        data: { type: String },
        createdOn: { type: Date, default: Date.now }
    }],
    checkInDate: { type: Date },
    dateCount: { type: Number, default: 0 },
    taskDate:{type:Date},
    todayCheckInAmount: { type: Number, default: 0 },
    totalCheckInAmount: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },

});

export const Users = mongoose.model('Users', usersSchema);