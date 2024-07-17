const request = require('supertest'); 

const app = require('../app');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json");
require("jest-sorted");


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
      expect(body.msg).toBe("Bad Request")
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

describe('sorting the articles', () => {
  test("the articles should be sorted by date in descending order", () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toBeSortedBy("created_at", {descending:true})
      })
  })
  test(" there should not be a body property present on any of the article objects", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        expect(body.articles.body).toBeUndefined()
      })
  })
  test('responds with 400 when passed an invalid sort_by query', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid-query')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid Query');
      });
  });
  test("responds 200 and sorted by valid query", () => {
    return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy("author");
        });
});
})

 //tests for comments 

 describe("GET comments for the article", () => {
  test("Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          }));
        });
      });
  });
  test("Comments should be served with the most recent comments first", () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body}) => {
      expect(body.comments).toBeSortedBy("created_at", {descending:true})
    })
  })
  test("returns an empty array and 200 status if article has no comments", () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  test("returns 404 Not Found if no article but valid request", () => {
    return request(app)
    .get('/api/articles/99/comments')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("returns 400 Bad Request if article_id is not valid", () => {
      return request(app)
      .get('/api/articles/no_valid_query/comments')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request")
      })
  })
});


//tests for posting comments 

describe("POST comments", () => {
  test("adds comment to the article and responds with the posted comment by registered user", () => {
    //arr 
    const newComment = {
      author: 'icellusedkars',
      body: 'My first comment'
    }
    //act 
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(expect.objectContaining({
          comment_id: expect.any(Number),
          body: 'My first comment',
          author: 'icellusedkars',
          article_id: 1,
          created_at: expect.any(String),
          votes: 0
        }));
      });
  });
  test("returns 403 status when non-registered user wants to add comment to article", () => {
    //arr 
    const newComment = {
      author: 'Svitlana',
      body: 'My first comment'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(403)
    .then(({body}) => {
      expect(body.msg).toBe("The client doesn't have permission to perform the action.")
    })
  })
})
 

// tests for updating articles with votes

describe("PATCH /api/articles/:article_id", () => {
  test("updated article with status 200", () => {

    //arr
    const newVote = { inc_votes: 1 }; 
    //act 
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body}) => {
      expect(body.article.votes).toBe(101)
    })
  })
  test("returns 400 status if inc_votes is NaN", () => {
    const newVote = {inc_votes: "one"}

    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("returns 404 status if article does not exist", () => {
    const newVote = { inc_votes: 1 };

    return request(app)
    .patch("/api/articles/99")
    .send(newVote)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
})