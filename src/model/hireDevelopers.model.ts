import * as mongoose from "mongoose";

export interface HireDevelopersDocument extends mongoose.Document {
    _id: any;
    adminId: any;
    role: string;
    title: string;
    introduction: any[];
    highlights: any[];
    services:any;
    whyUs:any
    hiringModels: any;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const hireDevelopersSchema = new mongoose.Schema(
    {
         _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        adminId: { type: mongoose.Types.ObjectId, ref: "AdminPanel" },
        role: { type: String, required: true },
        title: { type: String, required: true },
        introduction: [{ type: String }],
        highlights: [{ type: String }],
        services: {
            title: { type: String },
            description: { type: String },
            items: [{ type: String }],
        },
        whyUs: {
            title: { type: String },
            description: { type: String },
        },
        hiringModels: {
            title: { type: String },
            options: [
                {
                    name: { type: String },
                    description: { type: String },
                },
            ],
            conclusion: { type: String },
        },
        isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});

export const HireDevelopers = mongoose.model("HireDeveloper", hireDevelopersSchema);
