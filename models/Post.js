import mongoose from "mongoose";

const PostShema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    tags: { type: Array, default: [] },
    viewsCount:{ type: Number,
    default:0},
    imgUrl: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true,
       
      }
  },

  { timestamps: true }
);
export default mongoose.model("Post", PostShema);
