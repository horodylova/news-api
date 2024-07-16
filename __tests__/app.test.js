const request = require('supertest'); 

const app = require('../app');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

///tests for api, including bad requests 

describe('GET /api', () => {
  test('responds with a json detailing all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});



  describe("invalid endpoint", () => {
    test("responds with a 404 status and an arror message ehen given an endpoint that does nor exist", () => {
      return request(app)
      .get("/api/not-an-endpoint")
      .expect(404)
      .then(({body}) => {
        expect(body.message).toBe('Not Found')
      })
    })
  })

  //tests for topics 

  describe('GET /api/topics', () => {
    test('responds with status 200 and an array containing data of all topics', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          expect(body.topics.length).toBeGreaterThan(0);
  
          expect(body.topics[0]).toEqual({
            description: 'The man, the Mitch, the legend',
            slug: 'mitch'
          });
  
          body.topics.forEach(topic => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
              })
            );
          });
        });
    });
  });


  //tests for articles 

  describe("GET /api/articles", () => {
    test("responds with 200 status with full list of articles", () => {
      return request(app) 
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
          expect(Array.isArray(body.articles)).toBe(true)
      })
  }) 
})

describe("GET /api/articles/:article_id", () => {
  test('status 200 responds with the requested article', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body}) => {
      expect(body.article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("400 status when article_id is invalid", () => {
    return request(app)
    .get('/api/articles/svitlana')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request")
    })
  })
   test('404 status when article_id is valid but does not exist', () => {
    return request(app)
    .get('/api/articles/999')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
   })
})

 

 