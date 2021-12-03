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

// ! TEST SORT BY & ORDER BY and FILTER BY

describe("Get reviews with sort by and order by", () => {
  test("should return ALL reviews", async () => {
    const { body } = await request(app).get("/api/reviews").expect(200);
    expect(body.reviews).toBeInstanceOf(Array);
  });

  test("should return reviews by title sort DESC order ", async () => {
    const {
      body: { reviews },
    } = await request(app).get("/api/reviews?sort_by=title").expect(200);

    expect(reviews).toBeInstanceOf(Array);
    expect(reviews[0].title).toBe("Ultimate Werewolf");
  });

  test("status: 400 for invalid sort_by query ", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=invalid_column ")
      .expect(400);

    expect(body.msg).toBe("Invalid sort_by query");
  });

  test("should return reviews by title sort ASC order ", async () => {
    const {
      body: { reviews },
    } = await request(app)
      .get("/api/reviews?sort_by=title&order=ASC")
      .expect(200);
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews[0].title).toBe(
      "A truly Quacking Game; Quacks of Quedlinburg"
    );
  });

  test("status: 400 for invalid order query ", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=title&order=ASCCCC ")
      .expect(400);

    expect(body.msg).toBe("Invalid order query");
  });

  test("should return reviews by title sort ASC order FILTERED BY category=strategy", async () => {
    const {
      body: { reviews },
    } = await request(app)
      .get("/api/reviews?sort_by=title&order=ASC&category=social deduction")
      .expect(200);
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews[0].title).toBe(
      "A truly Quacking Game; Quacks of Quedlinburg"
    );
  });

  test("status: 400 for invalid order query ", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=title&order=ASCCCC ")
      .expect(400);

    expect(body.msg).toBe("Invalid order query");
  });
});

// ! TEST: GET COMMENTS BY REVIEW ID

describe("GET COMMENTS BY REVIEW ID", () => {
  test("should get comments by review ID", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/reviews/2/comments").expect(200);

    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(3);
    comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        })
      );
    });
  });

  test("Should return 404 for non-existent ID", async () => {
    const { body } = await request(app)
      .get("/api/reviews/100/comments")
      .expect(404);

    expect(body.msg).toBe("We could not get comments for review_id 100");
  });

  test("Should return 400 for bad review ID", async () => {
    const { body } = await request(app)
      .get("/api/reviews/myID/comments")
      .expect(400);

    expect(body.msg).toBe("Received 22P02 error message");
  });

  test("Should return 400 for invalid path", async () => {
    const { body } = await request(app).get("/api/reviews/2/comm").expect(404);

    expect(body.msg).toBe("We could not fulfil your request");
  });
});
