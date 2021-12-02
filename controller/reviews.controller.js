const {
  selectReviews,
  selectReviewsById,
  updateReviewVotes,
} = require("../model/reviews.model");

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await selectReviews();
    res.status(200).send({ reviews: reviews });
  } catch (err) {
    next(err);
  }
};

exports.getReviewsById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await selectReviewsById(review_id);
    res.status(200).send({ review: review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewVotes = async (req, res, next) => {
  console.log("in patch...");
  try {
    const review_id = req.params.review_id;
    const voteBody = req.body;

    const review = await updateReviewVotes(review_id, voteBody);
    res.status(200).send({ review: review });
  } catch (err) {
    console.log("IN CONTROLLER ERROR...", err.message);

    console.log(err.status, err.code);
    next(err);
  }
};
