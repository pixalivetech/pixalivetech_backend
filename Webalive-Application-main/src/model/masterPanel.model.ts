import * as mongoose from "mongoose";

export interface mastersDocument extends mongoose.Document {
    _id: string;
    addedBy: string;
    firstName: string;
    middleName: string;
    lastName: string;
    imageUrl: string;
    gender: string;
    dob: string;
    mobileNumber: number;
    email: string;
    address: string;
    designation: string;
    country: string;
    state: string;
    city: string;
    pinCode: number;
    verificationOtp: number;
    isDeleted: boolean;
    status: number;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;
}

const masterSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    addedBy: { type: mongoose.Types.ObjectId, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    imageUrl: { type: String },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, required: true },
    designation: { type: String, required: true },
    country: { type: String , required: true },
    state: { type: String , required: true},
    city: { type: String , required: true},
    pinCode: { type: Number , required: true},
    verificationOtp: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});

export const Master = mongoose.model("masterPanel", masterSchema);