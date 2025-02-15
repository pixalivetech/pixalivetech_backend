import mongoose from "mongoose";

export interface LaptopRentalDocument extends mongoose.Document {
    _id?: any;
    adminId?:any;
    title: String;
    desc: String;
    price:String;
    img: String;
    status?: Number;
    isDeleted?: Boolean;
    createdOn?: Date;
    createdBy?: String;
    modifiedOn?: Date;
    modifiedBy?: String;

}

const LaptopRentalSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    adminId:{type:mongoose.Types.ObjectId,ref:"AdminPanel"},
    title: { type: String },
    desc: { type: String },
    price: { type: String },
    img: { type: String },
    status: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})
export const LaptopRental = mongoose.model("LaptopRental", LaptopRentalSchema);