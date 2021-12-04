const db = require("../db/connection");

exports.deleteCommentsById = async (comment_id) => {
  const comment = await db.query(
    `DELETE FROM comments
    WHERE comment_id=$1 RETURNING *;`,
    [comment_id]
  );
  console.log(comment.rows[0]);
  // if no review found for this id
  if (!comment.rows[0]) {
    return Promise.reject({
      status: 400,
      msg: "Comment could not be deleted",
    });
  } else {
    return comment.rows[0];
  }
};
