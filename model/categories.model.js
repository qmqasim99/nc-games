const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`select * from categories`).then((categories) => {
    return categories.rows;
  });
};
