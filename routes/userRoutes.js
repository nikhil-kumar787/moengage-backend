import express from "express";
// import { addRating, getReviews } from "../controllers/reviewController.js";
import {
  authUser,
  registerUser,
  getReviews,
  addRating,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/review/:id", getReviews);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/review", addRating);

export default router;
