import mongoose from 'mongoose';

export interface CategoryDocument extends mongoose.Document {
    category:String;
    categoryImage:String;
    isDeleted:Boolean,
    status:Number,
    createdOn:Date,
    createdBy:String,
    modifiedOn:Date,
    modifiedBy:String
}

const categorySchema = new mongoose.Schema({
  category:{type:String},
  categoryImage:{type:String},
  isDeleted:{type:Boolean,default:false},
  status:{type:Number,default:1},
  createdOn:{type:Date,default:Date.now},
  createdBy:{type:String,default:""},
  modifiedOn:{type:Date,default:Date.now},
  modifiedBy:{type:String,default:""}
});

export let Category = mongoose.model("Category",categorySchema);