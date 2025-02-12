import mongoose from "mongoose";
 
export interface contactDocument extends mongoose.Document{
    _id?: any;
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    isDeleted?: boolean ;
    createdOn?: Date
    createdBy?: string
    modifiedOn?: Date
    modifiedBy?: string
}
 
const contactSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: { type: String },
    email: { type: String, lowercase: true, trim: true },
    subject:{ type: String },
    message: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date  , default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
   
})
 
export const contact = mongoose.model("Contact us",contactSchema)