const {
  selectReviews,
  selectReviewsById,
  updateReviewVotes,
  selectCommentsByReviewId,
  insertCommentsByReviewId,
} = require("../model/reviews.model");
const { pagination } = require("../utils");

exports.getReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query;

    const reviews = await selectReviews(sort_by, order, category);
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

exports.getCommentsByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const limit = req.query.limit;
    const page = req.query.p;

    const comments = await selectCommentsByReviewId(review_id);

    // if limit and page is not undefined
    if (limit && page) {
      console.log("IN PAGINATION", limit, page);
      const paginatedComments = pagination(comments, limit, page);
      res.status(200).send({ comments: paginatedComments });
    } else {
      res.status(200).send({ comments: comments });
    }
  } catch (err) {
    next(err);
  }
};

exports.postCommentsByReviewId = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;
    const commentBody = req.body;

    console.log("IN postCommentsByReviewId", review_id, commentBody);

    const comment = await insertCommentsByReviewId(review_id, commentBody);
    res.status(201).send({ comment: comment });
  } catch (err) {
    console.log("IN CONTROLLER ERROR...", err.message);

    console.log(err.status, err.code);
    next(err);
  }
};
