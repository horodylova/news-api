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

///tests for api, including bad request, added get 

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

  describe('GET /api/articles', () => {
    test('responds with 200 status with full list of articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
        });
    });
  
    test('the articles should be sorted by date in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy('created_at', { descending: true });
        });
    });
  
    test('responds with 400 when passed an invalid sort_by query', () => {
      return request(app)
        .get('/api/articles?sort_by=invalid-query')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Query');
        });
    });
  
    test('responds 200 and sorted by valid query', () => {
      return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy('author',  { descending: true });
        });
    });
  
    test('should change the sort order with an order query', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy('created_at', { ascending: true });
        });
    });
  
    test('responds with 200 and the filtered list of articles according to the topic name', () => {
      return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          articles.forEach(article => {
            expect(article.topic).toBe('cats');
          });
        });
    });
  
    test('responds 404 Not Found if the topic does not exist when filtering by topic', () => {
      return request(app)
        .get('/api/articles?topic=non-existing-slug')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
  
    test('responds with all articles if topic query is omitted', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
        });
    });
    test("should return article by id if no comments", () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({ body }) => {
          expect(Number(body.article.comment_count)).toBe(0)
        })
    })
    test("returns 200 status with current comment_count", () => {
      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Number(body.article.comment_count)).toBe(11)
      })
    })
  });

  //tests for posting a new article 
  
  describe("POST /api/articles", () => {
    test("returns 201 status when a new article created (with img)", () => {
      const newArticle = {
        author: 'icellusedkars',
        title: "How my cat spends the weekend",
        body: 'Weekends are a special time in our household, especially for my cat, Whiskers. As soon as the sun rises on Saturday morning, Whiskers is already at the window, soaking up the early morning rays and watching the world come to life. His mornings are spent lounging on his favorite perch, a cozy spot that offers the best view of the garden.',
        topic: "cats",
        article_img_url: 'https://media-be.chewy.com/wp-content/uploads/2016/05/20122949/signs-of-cat-pain-1024x615.jpg'
      };
      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201) 
        .then((response) => {
          expect(response.body.article).toMatchObject(newArticle);
        });
    });
    test("returns 404 status when author does not exist", () => {
      const newArticle = {
        author: 'nonexistent_author',
        title: "How my cat spends the weekend",
        body: 'Weekends are a special time in our household, especially for my cat, Whiskers. As soon as the sun rises on Saturday morning, Whiskers is already at the window, soaking up the early morning rays and watching the world come to life. His mornings are spent lounging on his favorite perch, a cozy spot that offers the best view of the garden.',
        topic: "cats",
        article_img_url: 'https://media-be.chewy.com/wp-content/uploads/2016/05/20122949/signs-of-cat-pain-1024x615.jpg'
};
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('Not Found');
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

// tests for updating comments with votes

describe("PATCH update the votes on a comment given the comment's comment_id", () => {
  test("returns 200 status and updates comment when the number of votes increases +1", () => {
    const newVote = { inc_votes: 1 }; 
    return request(app)
    .patch('/api/comments/1')
    .send(newVote)
    .expect(200)
  })
  test("returns 200 status and updates comment when the number of votes decreases -1", () => {
    const newVote = { inc_votes: -1 }; 
    return request(app)
    .patch('/api/comments/1')
    .send(newVote)
    .expect(200)
  })
  test("returns 400 status if inc_votes is NaN", () => {
    const newVote = {inc_votes: "one"}

    return request(app)
    .patch("/api/comments/1")
    .send(newVote)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
})

//tests for deleting the comment 

describe("DELETE the comment", () => {
  test("deletes the comment with status 204", () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
  })
  test("returns 404 if comment does not exist", () => {
    return request(app)
    .delete('/api/comments/999999')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not Found');
    });
  })
})

//tests for users 

describe("GET /api/users", () => {
  test("returns 200 status arn array of users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
      expect(body.users.length).toBeGreaterThan(0)
    
      body.users.forEach(user => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
          );
        });
      });
  });
  test("GET the user by username", () => {
    return request(app)
    .get("/api/users/rogersop")
    .expect(200)
    .then(({body}) => {
      expect(body.user.length).toBe(1)
      expect.objectContaining({
        username: 'rogersop',
        name: 'paul',
        avatar_url:
      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
      })
    })
  })
  test("returns 404 Not Found if user does not exist", () => {
    return request(app)
    .get("/api/users/svitlana")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
})

