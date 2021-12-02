const format = require("pg-format");
const db = require("../connection");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  // 1. create tables

  return (
    db
      .query("DROP TABLE if EXISTS comments")

      .then(() => {
        return db.query("DROP TABLE if EXISTS reviews");
      })
      .then(() => {
        return db.query("DROP TABLE if EXISTS categories");
      })
      .then(() => {
        return db.query("DROP TABLE if EXISTS users");
      })
      .then(() => {
        return db.query(`create table categories (
          slug varchar(100) primary key not null,
          description text NOT NULL
        )`);
      })
      .then(() => {
        return db.query(`create table users (
        username varchar(50) primary key not null,
        name varchar(100) not null,
        avatar_url text
      )`);
      })
      .then(() => {
        return db.query(`create table reviews (
        review_id SERIAL PRIMARY KEY, 
        title varchar not null,
        review_body text NOT NULL,
        designer varchar NOT NULL,
        review_img_url text default 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        category varchar(100) references CATEGORIES (slug)  ON DELETE CASCADE,
        owner varchar(50) references users(username) ON DELETE CASCADE,
        created_at TIMESTAMP  DEFAULT NOW() NOT NULL 
      )`);
      })
      .then(() => {
        return db.query(`create table comments (
        comment_id SERIAL PRIMARY KEY, 
        author varchar(50) references users(username) ON DELETE CASCADE,
        review_id INT references REVIEWS (review_id) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        body text NOT NULL
      )`);
      })

      // 2. insert data
      .then(() => {
        // format categories into array
        const formattedCategories = categoryData.map((category) => {
          return [category.slug, category.description];
        });

        const queryStr = format(
          `insert into categories (slug, description) VALUES %L returning *;`,
          formattedCategories
        );

        return db.query(queryStr);
      })
      .then(() => {
        // format users into array
        const formattedUsers = userData.map((user) => {
          return [user.username, user.name, user.avatar_url];
        });

        const queryStr = format(
          `insert into users (username, name, avatar_url) VALUES %L returning *;`,
          formattedUsers
        );

        return db.query(queryStr);
      })
      .then(() => {
        // format reviews into array
        const formattedReviews = reviewData.map((review) => {
          return [
            review.title,
            review.review_body,
            review.designer,
            review.review_img_url,
            review.votes,
            review.category,
            review.owner,
            review.created_at,
          ];
        });

        const queryStr = format(
          `insert into reviews (
            title ,
        review_body ,
        designer ,
        review_img_url ,
        votes,
        category,
        owner,
        created_at ) VALUES %L returning *;`,
          formattedReviews
        );

        return db.query(queryStr);
      })
      .then(() => {
        // format comments into array
        const formattedComments = commentData.map((comment) => {
          return [
            comment.author,
            comment.review_id,
            comment.votes,
            comment.created_at,
            comment.body,
          ];
        });

        const queryStr = format(
          `insert into comments (
            author ,
            review_id ,
            votes ,
            created_at ,
            body) VALUES %L returning *;`,
          formattedComments
        );

        return db.query(queryStr);
      })
  );
};

module.exports = seed;
