//const supertest = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

const request = require("supertest");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("TEST CATEGORIES", () => {
  test("should return greeting message ", () => {
    return request(app)
      .get("/")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toEqual("all ok");
      });
  });

  test("should return categories ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
      });
  });

  test("/api/cat : should return 404 error", () => {
    return request(app)
      .get("/api/cat")
      .expect(404)
      .then((response) => {
        //console.log(response);
        expect(response.body.msg).toBe("We could not fulfil your request");
      });
  });
});

// !  TEST REVIEWS

describe("TESTING REVIEWS", () => {
  test("should return ALL reviews", async () => {
    const { body } = await request(app).get("/api/reviews").expect(200);
    expect(body.reviews).toBeInstanceOf(Array);
  });

  test("Should return reviews by ID", async () => {
    const { body } = await request(app).get("/api/reviews/3").expect(200);
    console.log(body.review);
    expect(typeof body.review).toBe("object");
    expect(body.review.review_id).toBe(3);
    expect(body.review.comment_count).toBe(3);
  });

  test("Should return 404 for non-existent ID", async () => {
    const { body } = await request(app).get("/api/reviews/100").expect(404);

    expect(body.msg).toBe("We could not get your reviews for review_id 100");
  });

  test("Should return 400 for bad review ID", async () => {
    const { body } = await request(app).get("/api/reviews/my100").expect(400);

    expect(body.msg).toBe("Received 22P02 error message");
  });
});

// ! TEST VOTE UPDATES

describe(" TEST VOTE UPDATES ", () => {
  test("should update and return the updated review", async () => {
    // a make a new vote object
    // current vode is 5
    const inputVote = 1;
    const outputVote = 6;
    const newVote = { inc_votes: inputVote };
    const {
      body: { review },
    } = await request(app).patch("/api/reviews/2").send(newVote).expect(200);
    expect(review.review_id).toBe(2);
    expect(review.votes).toBe(outputVote);
  });

  test("should return 404 when attempting to update with non-existent id", async () => {
    // a make a new vote object
    const newVote = { inc_votes: 1 };
    const { body } = await request(app)
      .patch("/api/reviews/100")
      .send(newVote)
      .expect(404);
    expect(body.msg).toBe("We could not get your reviews for review_id 100");
  });

  test("should return 404 when attempting to update with invalid vote", async () => {
    // a make a new vote object with NO instead of an INT
    const newVote = { inc_votes: "No" };
    const { body } = await request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(400);
    expect(body.msg).toBe("Received 22P02 error message");
  });
});
