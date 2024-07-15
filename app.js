const express = require('express');
const app = express(); 
const endpoints = require('./endpoints.json')
const { getTopics } = require('./controllers/topicsControllers')

app.use(express.json())

app.get('/api', (request, response, next) => {
    response.status(200).send(({endpoints}))
})

app.get("/api/topics", getTopics)

app.use((req, res, next) => {
    res.status(404).send({ message: 'Not Found' });
  });

app.use((error, request, response, next) => {
    if(error.status){
        return response.status(error.status)
    }
    response.status(500).send({msg: "Internal Server Error"})
})

module.exports = app;