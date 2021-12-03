exports.handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log("IN handlePSQL400Errors ...");
    res.status(400).send({ msg: "Received 22P02 error message" });
  } else if (err.code === "23503") {
    console.log("IN handlePSQL400Errors ...");
    res
      .status(400)
      .send({ msg: "Received 23503 error message: Foreign Key violation" });
  }
  next(err);
};

// exports.handle404Errors = (err, req, res, next) => {
//   if (err.status === 404) {
//     res.status(404).send({ msg: err.msg });
//   }
//   next(err);
// };

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    console.log("IN handleCustomError ...", err.status);
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handle500Error = (err, req, res, next) => {
  res.status(500).send({ msg: "500 bad request" });
};
