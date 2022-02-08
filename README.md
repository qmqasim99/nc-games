# Games Reviews API

## Background

Welcome to my Games Reviews API!

This project was created to showcase development capabilities in building a backend server to serve REST API with various endpoints.

This REST API is developed with JavaScript, Node.js, ExpressJS and Axios. The backend database is developed with PostgreSQL.

The API is hosted at [https://qm-nc-games.herokuapp.com/](https://qm-nc-games.herokuapp.com/)

You can follow the instructions below to clone the repo, then build and test your own version of the api.

Minimum version requirements:

- `Node.js` v16.10.0
- `Postgres` v12.9

### Clone github repository

Run the following command in your project directory terminal to clone the repo:

`git clone https://github.com/qmqasim99/nc-games.git`

### Installing the dependencies

Move into repository directory and run `npm install` to install all the dependencies.

The project uses the following dependencies:

**Dev & testing dependencies:**

- `jest`
- `jest-sorted`
- `supertest`

**Runtime dependencies**

- `pg`
- `pg-format`
- `dotenv`
- `express`

### Setup Databases

Two separate .env files are needed for database connections:

Create `.env.test` file and enter `PGDATABASE=nc_games_test` in that file. Save and close the file

Create `.env.development` file and enter `PGDATABASE=nc_games` in that file. Save and close the file

From the root project folder, create the empty development and test databases by using the following command:

`npm setup-dbs`

Now we can create database tables and populate them with the development data.

Run `npm seed` to populate the development data.

### Running the Tests

Various tests have been written in **tests** folder. All tests are defined in the `app.test.js` file, and can be run by running `npm test` in the terminal.

## Examples of endpoints:

### GET

/api = This will bring you to the main api route that will display a full list of potential endpoints available.

/api/categories = Responds with an array of category objects.

/api/reviews/:review_id = Responds with a review object specified by the review_id.

/api/reviews = Responds with a reviews array, containing all reviews.

There are various queries available for this end point:

sort_by = 'title', 'owner', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'count'.
order = asc or desc.
category = Specify a game category and results will be returned ust for that category.

Use 'page' and 'limit' respectively to use pagination.

/api/reviews/:review_id/comments = Responds with an array of comments for the given review_id.

### PATCH:

/api/reviews/:review_id = Number of votes for a review can be increased by sending an object in the form of {inc_votes: number}.

### POST:

/api/reviews/:review_id/comments = A new comment can be posted for a given review. Use {username: 'string', body: 'string'} to send the new data. A response is sent back with the new comment details.

### DELETE:

/api/comments/:comment_id: Delete the requested comment with the corresponding comment_id. Will respond with '204'.
