import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },

    description: {
      type: String,
      minlength: [5, "Description must be more than 5 characters"],
      trim: true,
    },
    brand_logo:{
      type:{
        path:{
          type:String
        },
        public_id:{
          type:String,
          required:true
        }
      }
    }
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;