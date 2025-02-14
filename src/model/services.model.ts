import * as mongoose from "mongoose";

export interface ServicesDocument extends mongoose.Document {
    title: string;
    breadcrumb: string;
    introduction: string;
    expertiseTitle: string;
    expertiseList: { platform: string; technologies: string }[];
    callToAction: {
        text: string;
        linkText: string;
        linkUrl: string;
    };
    createdOn?: Date;
    modifiedOn?: Date;
}


const servicesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    breadcrumb: { type: [String], required: true },
    introduction: { type: [String], required: true },
    expertiseTitle: { type: String, required: true },
    expertiseList: [
        {
            platform: { type: String, required: true },
            technologies: { type: String, required: true }
        }
    ],
    callToAction: {
        text: { type: String, required: true },
        linkText: { type: String, required: true },
        linkUrl: { type: String, required: true }
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date }
});


export const Services = mongoose.model("Service", servicesSchema);
