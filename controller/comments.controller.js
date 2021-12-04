const express = require("express");
const { deleteCommentsById } = require("../model/comments.model");

exports.deleteComments = async (req, res, next) => {
  try {
    const deletedComment = await deleteCommentsById(req.params.comment_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
