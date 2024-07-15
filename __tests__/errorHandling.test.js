const request = require('supertest');
const app = require('../app');
const db = require("../db/connection");

describe('Error Handling: Status 500', () => {
  test('responds with status 500 when database connection fails', () => {
   
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
});