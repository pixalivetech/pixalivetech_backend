import * as mongoose from "mongoose";

export interface CompanyDocument extends mongoose.Document {
    _id?: any;
    CompanyName?: string;
    mobile?: number;
    email?: string;
    otp?:number;
    companyCode?:String;
    CompanyUrl?:String ;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
};

const CompanySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    CompanyName: { type: String },
    mobile: { type: Number },
    companyCode:{type:String},
    otp:{type:Number},
    email: { type: String, lowercase: true },
    CompanyUrl: { type: String , default :""},
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const Company = mongoose.model("company", CompanySchema);