exports.handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid value' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Invalid value' });
  }
  next(err);
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handle500Error = (err, req, res, next) => {
  res.status(500).send({ msg: '500 bad request' });
};
