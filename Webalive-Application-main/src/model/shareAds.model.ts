import mongoose from "mongoose";


export interface ShareAdsDocument {
    _id?: mongoose.Types.ObjectId;
    advertiserId?: mongoose.Types.ObjectId;
    advertisementTitle?: string;
    advertisementDescription?: string;
    advertisementType?: string;
    allocatedAmount?: number;
    amoutPerView?: number;
    url?: string;
    landingPageUrl?: string;
    likes?: number;
    view?: boolean;
    currentStatus?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const shareAdsSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    advertiserId: { type: mongoose.Types.ObjectId,ref : "Advertiser" },
    advertisementTitle: { type: String },
    advertisementDescription: { type: String },
    advertisementType: { type: String },
    allocatedAmount: { type: Number },
    amoutPerShare: { type: Number },
    url: { type: String },
    landingPageUrl: { type: String },
    likes: { type: Number },
    view: { type: Boolean, default: false },
    currentStatus: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const ShareAds = mongoose.model("ShareAds", shareAdsSchema);




