const express = require('express');
const app = express();
const cors = require('cors');

const usersRouter = require("./routes/users-router")
const articlesRouter = require("./routes/articles-router")
const topicsRouter = require("./routes/topics-router");
const commentsRouter = require("./routes/comments-router")

const endpoints = require('./endpoints.json');
app.use(cors());
 
app.use(express.json());

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints });
});

app.use('/api/users', usersRouter);
app.use('/api/articles', articlesRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/comments", commentsRouter)

app.use((err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502') {
    return res.status(400).send({ msg: 'Bad Request' });
  }
  next(err);
});

app.use((req, res, next) => {
  res.status(404).send({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.msg || 'Internal Server Error';
  res.status(status).send({ msg: message });
});

module.exports = app;
