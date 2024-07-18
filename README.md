Setup Instructions

To set up the project, follow these steps:

Clone the Repository:

git clone https://github.com/horodylova/news-api

Install Dependencies:

Ensure Node.js and npm are installed. Then, install project dependencies:

npm install

Create two environment configuration files .env.test and .env.development in the root directory of the project.These environment variables are used to configure the PostgreSQL database connections.

Create .env.test: PGDATABASE=nc_news_test

Create .env.development: PGDATABASE=nc_news

Ensure PostgreSQL is installed and running.

Seed the Database: npm run seed

Running Tests: npm test

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
