import * as  mongoose from "mongoose";

export interface ClientDocument extends mongoose.Document{
    _id?:any;
    adminId?:any;
    clientName?:string;
    clientEmail?:number;
    mobileNo?:number;   
    location?:string;
    logo?:string;
    isDeleted?:boolean;
    status?:number;
    createdOn?: Date ;
    createdBy?:String;
    modifiedOn?: Date ;
    modifiedBy ?: string;
};

const clientSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId , required :true , auto :true},
    adminId:{type :mongoose.Types.ObjectId , ref :'Admin'},
    clientName:{type:String},
    clientEmail:{type:String},
    mobileNo:{type:Number},
    location:{type:String},
    logo:{type:String , default :'https://pixalivetech.s3.amazonaws.com/Clients/Logos.png'} ,
    isDeleted:{type:Boolean , default :false},
    status:{type:Number , default :1},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const client = mongoose.model("client",clientSchema);