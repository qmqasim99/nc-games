const {
  getReviews,
  getReviewsById,
  patchReviewVotes,
} = require("../controller/reviews.controller");

const reviewsRouter = require("express").Router();

// /reviews/
reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewVotes);

module.exports = reviewsRouter;
