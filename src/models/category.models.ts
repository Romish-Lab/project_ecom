import mongoose from "mongoose";
const categorySchema=new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true,"name is required"],
            minLength:[3,"name must be 3 char. long"],
            trim:true
        },
        description:{
            type:String,
            minLength:[5,"Description must be 5 char long"],
            trim:true
        }
    },
    {timestamps:true}
)

const Category= mongoose.model("Category",categorySchema);
export  default Category;