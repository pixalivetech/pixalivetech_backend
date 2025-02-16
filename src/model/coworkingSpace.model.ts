import * as mongoose from "mongoose";

export interface WorkingSpaceDocument extends mongoose.Document {
    _id:any;
    adminId: any;
    title: string;
    introduction: any[];
    facilities: any[];
    waysOfWorking: any[];
    status: number;
    isDeleted: boolean;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;
}

const workingSpaceSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    adminId:{type:mongoose.Types.ObjectId,ref:"AdminPanel"},
    title: { type: String },
    introduction: [ { type: String}],
    facilities:[ { type: String}],
    waysOfWorking: [
           {
            type: { type: String },
            description: { type: String},
            features:[{type:String}]
           }
    ],
    status: {type:Number,default:1},
    isDeleted: {type: Boolean,default: false},
    createdOn: {type: Date},
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: {type: String},
    modifiedOn: {type: Date},
    modifiedBy: {type: String},
});


export const WorkingSpace = mongoose.model("CoWorkingSpace", workingSpaceSchema);
