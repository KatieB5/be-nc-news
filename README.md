# Northcoders News API

### Introduction

This Northcoders (NC) News API is a RESTful HTTP API designed to serve information on users, topics, articles, and comments to a front-end architecture (awaiting construction...). 

There are 3 databases in this project:
    - A test database with simple test data
    - A development database with more complex development data
    - The ElephantSQL production database seeded with development data

It was created as a back-end project whilst completing the Northcoders software engineering bootcamp.

This API is deployed at: https://be-nc-news-3me1.onrender.com 

### Technologies and tools
The NC News API was built using the following technologies and tools:

- Node.js and Express.js for building API
- PostgreSQL and ElephantSQL for storing, managing and querying data
- Jest and Supertest for building API endpoints functionality using TDD approach
- Dotenv for configuring sensitive information as database credentials, API keys

### Getting started
1. Clone this repository (https://github.com/KatieB5/be-nc-news); the main branch is the most stable branch at any given time, ensure you're working from it
2. cd into the cloned repo folder
3. Run npm install to install all dependencies
    - Minimum required veriosn of Node.js: v21.1.0
    - Minimum required veriosn of Postgres: v16
4. If you wish to clone this project and run it locally, you will need to create 2 .env files in root: .env.test and .env.development
    - Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).
5. Set up the PostgreSQL databases: npm run setup-dbs
6. Seed the databases with the initial data: npm run seed
7. Start the server listening on port 9090: npm start
8. Connect to the API using your chosen platform e.g., Postman, Insomnia

###Available APIs

All available APIs are listed in the endpoints.json file. GET /api will also serve up a json representation of all the available endpoints of the api.

