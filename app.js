const express = require('express');
const app = express(); 
const endpoints = require('./endpoints.json')
const { getTopics , getAllArticles, getArticleById, getComments } = require('./controllers')

app.use(express.json())

app.get('/api', (request, response, next) => {
    response.status(200).send(({endpoints}))
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getComments)

app.use((err, req, res, next) => {
 
  if (err.code === '22P02' || err.code === '23502' || err.code === '23502') {
    return res.status(400).send({ msg: 'Bad Request' });
  }

  next(err);
});

app.use((req, res, next) => {

    res.status(404).send({ message: 'Not Found' });
  });

 
  
  app.use((err, req, res, next) => {
    if (err.status) {
      return res.status(err.status).send({ msg: err.msg });
    }
    console.log('500 cought');
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;