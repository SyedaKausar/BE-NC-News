const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
require("jest-sorted");
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
    return request(app)
      .get("/api/apples")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an Article object with comment count", () => {
    return request(app)
      .get("/api/articles/1")
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
          comment_count: "11",
        });
      });
  });
  test("status 400: responds with bad request when invalid input", () => {
    return request(app)
      .get("/api/articles/cats")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article", () => {
    const incrementBy = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(incrementBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 105,
        });
      });
  });
  test("status 400: responds with bad request when invalid input", () => {
    const incrementBy = { inc_votes: "not_a_number" };
    return request(app)
      .patch("/api/articles/1")
      .send(incrementBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 404: not found when article doesn't exist", () => {
    const incrementBy = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/99999")
      .send(incrementBy)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("status 400: responds with bad request when vote key is missing", () => {
    const incrementBy = { not_a_Key: 1 };
    return request(app)
      .patch("/api/articles/cats")
      .send(incrementBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request, required fields missing");
      });
  });
});
describe("GET /api/users", () => {
  test("200: responds with an array of objects with the username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
      });
  });
  test("status 404: not found when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/notusers")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
describe("GET /api/articles", () => {
  test("status 200: responds with an array of article objects with comment count and sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: not found when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/notusers")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual([
          {
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 16,
            author: "butter_bridge",
            article_id: 9,
            created_at: "2020-04-06T12:17:00.000Z",
          },
          {
            comment_id: 17,
            body: "The owls are not what they seem.",
            votes: 20,
            author: "icellusedkars",
            article_id: 9,
            created_at: "2020-03-14T17:02:00.000Z",
          },
        ]);
      });
  });
  test("status 404: not found when article doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("status 404: not found when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/articles/2/notcomments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
