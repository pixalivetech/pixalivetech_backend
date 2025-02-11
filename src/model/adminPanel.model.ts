import * as mongoose from "mongoose";

export interface PanelDocument extends mongoose.Document {
    _id?: any;
    userName?: string;
    mobile?: number;
    companyName?:string;
    email?: string;
    password?:string;
    imageUrl?:string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
};

const panelSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userName: { type: String },
    mobile: { type: Number },
    companyName:{type:String},
    email: { type: String, lowercase: true },
    password:{type:String},
    imageUrl:{type:String, default:"https://upturnhrmanagement.s3.ap-south-1.amazonaws.com/employee/men.png"},
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const Panel = mongoose.model("panel", panelSchema);