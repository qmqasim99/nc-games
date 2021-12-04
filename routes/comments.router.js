const { deleteComments } = require("../controller/comments.controller");

const commentsRouter = require("express").Router();

// comments/
commentsRouter.route("/:comment_id").delete(deleteComments);

module.exports = commentsRouter;
