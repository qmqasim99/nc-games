const {
  getReviews,
  getReviewsById,
  patchReviewVotes,
  getCommentsByReviewId,
} = require("../controller/reviews.controller");

const reviewsRouter = require("express").Router();

// /reviews/
reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewVotes);
reviewsRouter.route("/:review_id/comments").get(getCommentsByReviewId);

module.exports = reviewsRouter;
