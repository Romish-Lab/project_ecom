import mongoose, { Document, Schema } from "mongoose";

// Interface for category logo
interface ICategoryLogo {
  path: string;
  public_id: string;
}

//  Main category interface
export interface ICategory extends Document {
  name: string;
  description?: string;
  category_logo: ICategoryLogo;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name must be 3 char. long"],
      trim: true,
    },
    description: {
      type: String,
      minLength: [10, "Description must be 10 char long"],
      trim: true,
    },
    category_logo: {
      required: [true, "category_logo is required"], //! this is for cloudinary image, not for validation, because we are handling validation in controller
      type: {
        path: {
          type: String,
          default: "", //  default added so it works without image
        },
        public_id: {
          type: String,
          default: "", //  removed required:true, added default instead
        },
      },
    },
  },
  { timestamps: true },
);

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
