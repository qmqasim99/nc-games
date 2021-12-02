const db = require("../db/connection");

exports.selectReviews = async () => {
  const result = await db.query(`
    SELECT * FROM reviews`);
  return result.rows;
};

exports.selectReviewsById = async (review_id) => {
  const review = await db.query(
    `SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.review_id) :: INT AS comment_count from reviews
     LEFT JOIN comments on reviews.review_id = comments.review_id 
    WHERE reviews.review_id=$1
GROUP BY reviews.review_id;`,
    [review_id]
  );
  //console.log(review.rows);
  // if no review found for this id
  if (!review.rows[0]) {
    console.log("IN MODEL: PROMISE REJECT");
    return Promise.reject({
      status: 404,
      msg: "We could not get your reviews for review_id " + review_id,
    });
  } else {
    return review.rows[0];
  }
};

exports.updateReviewVotes = async (review_id, voteBody) => {
  const { inc_votes } = voteBody;
  //console.log("in model ...", inc_votes, review_id);

  // get the review first

  let { votes } = await this.selectReviewsById(review_id);
  votes += inc_votes;
  console.log("votes ", votes);

  const review = await db.query(
    `UPDATE reviews 
      SET votes = $1
      WHERE review_id=$2 RETURNING *;`,
    [votes, review_id]
  );
  console.log(review.rows[0]);
  // if no review found for this id
  if (!review.rows[0]) {
    return Promise.reject({
      status: 404,
      msg: "Vote could not be updated for review_id " + review_id,
    });
  } else {
    return review.rows[0];
  }
};
