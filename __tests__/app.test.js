//const supertest = require("supertest");
const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const request = require('supertest');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe('TEST CATEGORIES', () => {
  test('should return categories ', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
      });
  });

  test('/api/cat : should return 404 error', () => {
    return request(app)
      .get('/api/cat')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('We could not fulfil your request');
      });
  });
});

// !  TEST REVIEWS

describe('TESTING REVIEWS', () => {
  test('Should return reviews by ID', async () => {
    const { body } = await request(app).get('/api/reviews/3').expect(200);

    expect(typeof body.review).toBe('object');
    expect(body.review.review_id).toBe(3);
    expect(body.review.comment_count).toBe(3);
  });

  test('Should return 404 for non-existent ID', async () => {
    const { body } = await request(app).get('/api/reviews/100').expect(404);

    expect(body.msg).toBe('We could not get your reviews for review_id 100');
  });

  test('Should return 400 for bad review ID', async () => {
    const { body } = await request(app).get('/api/reviews/my100').expect(400);

    expect(body.msg).toBe('Received 22P02 error message');
  });
});

// ! TEST VOTE UPDATES

describe(' TEST VOTE UPDATES ', () => {
  test('should update and return the updated review', async () => {
    // a make a new vote object
    // current vode is 5
    const inputVote = 1;
    const outputVote = 6;
    const newVote = { inc_votes: inputVote };
    const {
      body: { review },
    } = await request(app).patch('/api/reviews/2').send(newVote).expect(200);
    expect(review.review_id).toBe(2);
    expect(review.votes).toBe(outputVote);
  });

  test('should return 404 when attempting to update with non-existent id', async () => {
    // a make a new vote object
    const newVote = { inc_votes: 1 };
    const { body } = await request(app)
      .patch('/api/reviews/100')
      .send(newVote)
      .expect(404);
    expect(body.msg).toBe('We could not get your reviews for review_id 100');
  });

  test('should return 404 when attempting to update with invalid vote', async () => {
    // a make a new vote object with NO instead of an INT
    const newVote = { inc_votes: 'No' };
    const { body } = await request(app)
      .patch('/api/reviews/2')
      .send(newVote)
      .expect(400);
    expect(body.msg).toBe('Received 22P02 error message');
  });
});

// ! TEST SORT BY & ORDER BY and FILTER BY

describe('Get reviews with sort by and order by', () => {
  test('should return ALL reviews', async () => {
    const { body } = await request(app).get('/api/reviews').expect(200);
    expect(body.reviews).toBeInstanceOf(Array);
    expect(body.reviews).toBeSortedBy('created_at', {
      descending: true,
    });
  });

  test('should return reviews by title sort DESC order ', async () => {
    const {
      body: { reviews },
    } = await request(app).get('/api/reviews?sort_by=title').expect(200);

    expect(reviews).toBeInstanceOf(Array);
    expect(reviews[0].title).toBe('Ultimate Werewolf');
    expect(reviews).toBeSortedBy('title', { descending: true });
  });

  test('status: 400 for invalid sort_by query ', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=invalid_column ')
      .expect(400);

    expect(body.msg).toBe('Invalid sort_by query');
  });

  test('should return reviews by title sort ASC order ', async () => {
    const {
      body: { reviews },
    } = await request(app)
      .get('/api/reviews?sort_by=title&order=ASC')
      .expect(200);
    expect(reviews).toBeInstanceOf(Array);

    expect(reviews[0].title).toBe(
      'A truly Quacking Game; Quacks of Quedlinburg'
    );

    expect(reviews).toBeSortedBy('title');
  });

  test('status: 400 for invalid order query ', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=title&order=ASCCCC ')
      .expect(400);

    expect(body.msg).toBe('Invalid order query');
  });

  test('should return reviews by title sort ASC order FILTERED BY category=strategy', async () => {
    const {
      body: { reviews },
    } = await request(app)
      .get('/api/reviews?sort_by=title&order=ASC&category=social deduction')
      .expect(200);
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews[0].title).toBe(
      'A truly Quacking Game; Quacks of Quedlinburg'
    );
  });

  test('status: 400 for invalid order query ', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=title&order=ASCCCC ')
      .expect(400);

    expect(body.msg).toBe('Invalid order query');
  });
});

// ! TEST: GET COMMENTS BY REVIEW ID

describe('GET COMMENTS BY REVIEW ID', () => {
  test('should get comments by review ID', async () => {
    const {
      body: { comments },
    } = await request(app).get('/api/reviews/2/comments').expect(200);

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

  test('Should return 404 for non-existent ID', async () => {
    const { body } = await request(app)
      .get('/api/reviews/100/comments')
      .expect(404);

    expect(body.msg).toBe('We could not get comments for review_id 100');
  });

  test('Should return 400 for bad review ID', async () => {
    const { body } = await request(app)
      .get('/api/reviews/myID/comments')
      .expect(400);

    expect(body.msg).toBe('Received 22P02 error message');
  });

  test('Should return 400 for invalid path', async () => {
    const { body } = await request(app).get('/api/reviews/2/comm').expect(404);

    expect(body.msg).toBe('We could not fulfil your request');
  });
});

describe(' POST /api/reviews/:review_id/comments', () => {
  test('status:201, responds with comments newly added to the database', async () => {
    const newComment = {
      username: 'bainesface',
      body: 'new comment added',
    };

    const {
      body: { comment },
    } = await request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(201);
    expect(typeof comment).toBe('object');
    expect(comment.comment_id).toBe(7);
  });

  test('status:400, Dont insert if username is not provided', async () => {
    const newComment = {
      body: 'new comment added',
    };

    const { body } = await request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(400);
    expect(body.msg).toBe('Username was not provided');
  });

  test('status:400, Dont insert if body is not defined', async () => {
    const newComment = {
      username: 'bainesface',
    };

    const { body } = await request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(400);
    expect(body.msg).toBe('No comments were provided');
  });

  test('status:400, Dont insert if username does not exist', async () => {
    const newComment = {
      username: 'notValidUsername',
      body: 'new comment added',
    };

    const { body } = await request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(400);
    expect(body.msg).toBe(
      'Received 23503 error message: Foreign Key violation'
    );
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('status:204, responds with an empty response body', async () => {
    const response = await request(app).delete('/api/comments/2').expect(204);

    expect(response.body).toEqual({});
  });

  test('Should return 400 for non-existent ID', async () => {
    const { body } = await request(app).delete('/api/comments/200').expect(400);

    expect(body.msg).toBe('Comment could not be deleted');
  });

  test('Should return 400 for bad comment ID', async () => {
    const { body } = await request(app)
      .delete('/api/comments/myID')
      .expect(400);

    expect(body.msg).toBe('Received 22P02 error message');
  });
});

// ! TESTING PAGINATION
describe('TESTING PAGINATION', () => {
  test('should return comments limited by 2', async () => {
    const {
      body: { comments },
    } = await request(app)
      .get('/api/reviews/2/comments?limit=2&p=1')
      .expect(200);

    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(2);
  });

  test('should return comments limited by 3', async () => {
    const {
      body: { comments },
    } = await request(app)
      .get('/api/reviews/2/comments?limit=6&p=1')
      .expect(200);

    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(3);
  });

  test('should return comments limited by 1 of page 2', async () => {
    const {
      body: { comments },
    } = await request(app)
      .get('/api/reviews/2/comments?limit=2&p=2')
      .expect(200);

    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(1);
  });
});
