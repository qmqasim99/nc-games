const { getCategories } = require("../controller/categories.controller");

const categoriesRouter = require("express").Router();

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
