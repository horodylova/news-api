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

  describe('status 500', () => {
    test("responds with status 500 when database connection fails", () => {
      jest.spyOn(db, 'query').mockImplementation(() => {
        throw new Error('Database connection error');
      });
  
      return request(app)
        .get("/api/topics")
        .expect(500)
        .then(response => {
          expect(response.body.msg).toBe("Internal Server Error");
        });
    });
  })

 