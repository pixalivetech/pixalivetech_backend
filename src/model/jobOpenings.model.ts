import * as mongoose from "mongoose";

export interface JobOpeningsDocument extends mongoose.Document {
    _id: any;
    adminId: any;
    title: string;
    description: any[];
    qualifications: any[];
    extraQualifications:any[];
    email:string;
    vacancies:number;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const joobOpeningsSchema = new mongoose.Schema(
    {
         _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        adminId: { type: mongoose.Types.ObjectId, ref: "AdminPanel" },
        title: { type: String, required: true },
        description: [{ type: String }],
        qualifications: [{ type: String }],
        extraQualifications:[{ type: String }],
       email:{ type: String },
       vacancies:{ type: Number },
       isDeleted: { type: Boolean, default: false },
       status: { type: Number, default: 1 },
       createdOn: { type: Date },
       createdBy: { type: String },
       modifiedOn: { type: Date },
       modifiedBy: { type: String },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const Jobopenings = mongoose.model("Jobopening", joobOpeningsSchema);
