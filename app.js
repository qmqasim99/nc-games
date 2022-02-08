const express = require('express');

const app = express();

const { getGreetings } = require('./controller/categories.controller');
const {
  handlePSQL400Errors,
  handleCustomError,
  handle500Error,
  handle404Errors,
} = require('./errors');

const apiRouter = require('./routes/api.routes');

//app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// app.route("/").get(getGreetings);
app.use('/api', apiRouter);

// app.all("/*", (req, res) => {
//   res.status(404).send({ msg: "path not found" });
// });

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  err.msg = 'We could not fulfil your request';
  next(err);
});

//app.use("/api", apiRouter);
//app.get("/", getGreetings);

// ! ERRORS

//app.use(handle404Errors);
app.use(handlePSQL400Errors);
app.use(handleCustomError);
app.use(handle500Error);

module.exports = app;
