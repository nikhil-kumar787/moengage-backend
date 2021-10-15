import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Review from "../models/reviewModel.js";

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Register new user
//@route           POST /api/users/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const addRating = asyncHandler(async (req, res, next) => {
  const { name, rating, userId, animeId, desc } = req.body;

  const anime_review = await Review.findOne({
    userId: userId,
    animeId: animeId,
  });
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
    //const review = await Review.find({ userId: userId });

    if (anime_review) {
      const existingAnimeReview = await Review.findOneAndUpdate(
        { animeId: animeId, userId: userId },
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

export { authUser, registerUser, addRating, getReviews };
