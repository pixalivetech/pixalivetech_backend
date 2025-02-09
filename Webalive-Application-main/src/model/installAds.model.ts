import * as mongoose from "mongoose";

export interface InstallAdsDocument extends mongoose.Document {
    _id?:any;
    advertiserId?:string;
    advertiserName?:string;
    title?: string;
    description?: string;
    image?: string;
    tag?: string;
    steps?: any[];
    allocatedAmount?: number;
    amoutPerView?: number;
    appUrlLink?: string;
    currentStatus?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const installAdsSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    advertiserId: { type:mongoose.Types.ObjectId,ref:"Advertiser"},
    advertiserName: { type: String }, 
    title: { type: String },
    description: { type: String },
    image: { type: String },
    tag:{ type: String, default: "NEW" },
    steps: { type: Array },
    allocatedAmount: { type: Number },
    amountPerView: { type: Number },
    appUrlLink: { type: String },
    currentStatus: { type: String, default:"" },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export let InstallAds=mongoose.model("InstallAds",installAdsSchema)