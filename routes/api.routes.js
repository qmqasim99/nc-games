const { getGreetings } = require('../controller/categories.controller');
const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');
const commentsRouter = require('./comments.router');
const { getEndPoints } = require('../controller/api.controller');

const apiRouter = require('express').Router();

apiRouter.route('/').get(getEndPoints);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
