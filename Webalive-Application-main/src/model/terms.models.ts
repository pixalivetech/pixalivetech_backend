import mongoose from "mongoose";

export interface TermsDocument extends mongoose.Document{
    termsAndCondition?:String;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string; 
}


const termsSchema = new mongoose.Schema({
    termsAndCondition: {type: String,default:""},
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})



export const Terms = mongoose.model("Termsconditions",termsSchema);

