import mongoose from 'mongoose';

export interface FaqDocument extends mongoose.Document{
    publicQuestion?:String,
    publicAnswer?:String, 
    isDeleted?: Boolean;
    status?: Number;
    createdOn?: Date;
    createdBy?: String;
    modifiedOn?: Date;
    modifiedBy?: String ; 
  
}

const faqSchema = new mongoose.Schema({
    publicQuestion :{type:String},
    publicAnswer :{type:String},
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})
export const Faq = mongoose.model('Faq',faqSchema);