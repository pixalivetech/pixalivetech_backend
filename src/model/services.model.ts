import * as mongoose from "mongoose";

export interface ServicesDocument extends mongoose.Document {
    _id:any;
    adminId: any;
    title: string;
    introduction: any[];
    expertiseTitle: string;
    expertiseList: any[];
    callToAction: any;
    status: number;
    isDeleted: boolean;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;
}


const servicesSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    adminId:{type:mongoose.Types.ObjectId,ref:"AdminPanel"},
    title: { type: String },
    introduction: [ { type: String}],
    expertiseTitle: { type: String },
    expertiseList: [
        {
            platform: { type: String },
            technologies: { type: String}
        }
    ],
    callToAction: {
        text: { type: String},
        linkText: { type: String },
    },
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},
});


export const Services = mongoose.model("Service", servicesSchema);
