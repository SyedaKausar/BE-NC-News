const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(data);
});
describe("GET /api/topics", () => {
  test("status 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: not found when passed an invalid endpoint", () => {
    return request(app).get("/api/apples").expect(404);
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an Article object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 100,
        });
      });
  });
});
