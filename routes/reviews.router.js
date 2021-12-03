const {
  getReviews,
  getReviewsById,
  patchReviewVotes,
  getCommentsByReviewId,
  postCommentsByReviewId,
} = require("../controller/reviews.controller");

const reviewsRouter = require("express").Router();

// /reviews/
reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewVotes);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);

module.exports = reviewsRouter;
