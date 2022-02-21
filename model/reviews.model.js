const db = require('../db/connection');

exports.selectReviews = async (
  sort_by = 'created_at',
  order = 'DESC',
  category
) => {
  const columns = [
    'review_id',
    'title',
    'designer',
    'owner',
    'category',
    'created_at',
    'votes',
  ];

  if (!columns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
  }

  if (!['DESC', 'ASC'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  const queryValue = [];
  let queryStr = `SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.review_id) :: INT AS comment_count FROM reviews
  LEFT JOIN comments on reviews.review_id = comments.review_id `;

  if (category) {
    queryValue.push(category);
    queryStr += `WHERE category = $1 `;
  }

  queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order} ;`;

  const result = await db.query(queryStr, queryValue);

  return result.rows;
};

exports.selectReviewsById = async (review_id) => {
  const review = await db.query(
    `SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.review_id) :: INT AS comment_count FROM reviews
     LEFT JOIN comments on reviews.review_id = comments.review_id 
    WHERE reviews.review_id=$1
GROUP BY reviews.review_id;`,
    [review_id]
  );
  // if no review found for this id
  if (!review.rows[0]) {
    return Promise.reject({
      status: 404,
      msg: 'We could not get your reviews for review_id ' + review_id,
    });
  } else {
    return review.rows[0];
  }
};

exports.updateReviewVotes = async (review_id, voteBody) => {
  const { inc_votes } = voteBody;

  // get the review first

  let { votes } = await this.selectReviewsById(review_id);
  votes += inc_votes;

  const review = await db.query(
    `UPDATE reviews 
      SET votes = $1
      WHERE review_id=$2 RETURNING *;`,
    [votes, review_id]
  );

  // if no review found for this id
  if (!review.rows[0]) {
    return Promise.reject({
      status: 404,
      msg: 'Vote could not be updated for review_id ' + review_id,
    });
  } else {
    return review.rows[0];
  }
};

exports.selectCommentsByReviewId = async (review_id) => {
  const comments = await db.query(
    `SELECT comment_id :: INT, votes :: INT, created_at, author, body  FROM comments WHERE review_id=$1;`,
    [review_id]
  );
  // if no comments found for this id
  if (!comments.rows[0]) {
    return Promise.reject({
      status: 404,
      msg: 'We could not get comments for review_id ' + review_id,
    });
  } else {
    return comments.rows;
  }
};

exports.insertCommentsByReviewId = async (review_id, commentBody) => {
  const { username, body } = commentBody;

  if (!username) {
    return Promise.reject({
      status: 400,
      msg: 'Username was not provided',
    });
  }
  if (!body) {
    return Promise.reject({
      status: 400,
      msg: 'No comments were provided',
    });
  }

  const comment = await db.query(
    `INSERT INTO comments (review_id, author, body) 
     VALUES($1, $2, $3) RETURNING *;`,
    [review_id, username, body]
  );

  // if no review found for this id
  if (!comment.rows[0]) {
    return Promise.reject({
      status: 404,
      msg: 'Comment could not be inserted for review_id ' + review_id,
    });
  } else {
    return comment.rows[0];
  }
};
