import mongoose from 'mongoose'

export interface privacyDocument extends mongoose.Document {
    privacyPolicy?: String;
    isDeleted?: Boolean;
    status?: Number;
    createdOn?: Date;
    createdBy?: String;
    modifiedOn?: Date;
    modifiedBy?: String ;
}

const privacySchema = new mongoose.Schema ({
    privacyPolicy: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const privacy = mongoose.model('privacyPolicy', privacySchema)