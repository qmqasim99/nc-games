const express = require('express');

const apiEndpoints = {
  'GET: /api/categories': 'Responds with an array of category objects',
  'GET: /api/reviews/:review_id':
    'Responds with a review object specified by the review_id',
  'GET: /api/reviews':
    'Responds with a reviews array, containing all reviews. Can be used with queries: sort_by, order and category.',
  'GET: /api/reviews/:review_id/comments':
    'Responds with an array of comments for the given review_id',
  'PATCH: /api/reviews/:review_id':
    'Number of votes for a review can be increased by sending an object in the form of {inc_votes: number}.',
  'POST: /api/reviews/:review_id/comments':
    'A new comment can be posted for a given review. Use {username: string, body: string} to send the new data. A response is sent back with the new comment details.',
  'DELETE: /api/comments/:comment_id':
    'Delete the requested comment with the corresponding comment_id. Will respond with "204"',
};

exports.getEndPoints = (req, res, next) => {
  try {
    res.status(200).send({ endpoints: apiEndpoints });
  } catch (err) {}
};
