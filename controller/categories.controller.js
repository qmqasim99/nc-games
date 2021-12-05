const express = require("express");
const { selectCategories } = require("../model/categories.model");

exports.getGreetings = (req, res, next) => {
  try {
    res.status(200).send({ msg: "all ok on Heroku" });
  } catch (err) {}
};

// get all categories
exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};
