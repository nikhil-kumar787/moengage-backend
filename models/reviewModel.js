import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: String,
    },
    userId: {
      type: String,
    
    },
    animeId: {
      type: String,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
