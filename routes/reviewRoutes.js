import express from "express";
const router = express.Router();

import { addRating, getReviews } from "../controllers/reviewController";

router.get("/review/:id", getReviews);
router.post("/review", addRating);

export default router;
