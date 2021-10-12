import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel";

const addRating = asyncHandler(async (req, res, next) => {
  const { name, rating, userId, animeId, desc } = req.body;

  const anime_review = await Review.findOne({ userId: userId });
  if (!anime_review) {
    const review = new Review({
      name,
      rating,
      userId,
      animeId,
      desc,
    });
    const reviewed = await review.save();

    if (reviewed) {
      return res.status(201).json({
        message: "review added successfully",
      });
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  } else {
    const review = await Review.findOne({ userId: userId });

    if (review) {
      const existingAnimeReview = await Review.findOneAndUpdate(
        { animeId: animeId },
        { $set: { rating: rating, desc: desc } },
        { new: true, upsert: true, useFindAndModify: false }
      );
      return res.status(201).json({
        message: "review added successfully",
      });
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  }
});

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ animeId: req.params.id });

  if (reviews) {
    res.json(reviews);
  } else {
    res.status(404).json({ message: "reviews not found" });
  }

  res.json(reviews);
});

export { addRating, getReviews };
