const { getGreetings } = require("../controller/categories.controller");
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getGreetings);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
