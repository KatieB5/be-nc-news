const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index.js');
const fs = require('fs/promises');
const endpointsFile = require('../endpoints.json');

beforeEach(() => seed(data));

afterAll(() => {
    db.end(); 
});

describe('GET /api/topics', () => {
    test('GET 200: should respond with an array of topic objects, each of which should have the following properties: slug, description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topicsArr.length).toBe(3);
            expect(response.body.topicsArr).toMatchObject([
                {
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },
                {
                  description: 'Not dogs',
                  slug: 'cats'
                },
                {
                  description: 'what books are made of',
                  slug: 'paper'
                }
            ]);
        });
    });
    test('GET 404: should respond with a 404 not found if given an endpoint that does not exist', () => {
        return request(app)
        .get('/api/topicz')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Endpoint does not exist");
        });
    });
});

describe('GET /api', () => {
    test('GET 200: should respond with an object describing all the available endpoints on the nc news API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpointsFile);
        });
    });
});

describe('GET /api/articles/', () => {
    describe('GET /api/articles/:article_id', () => {
        test('GET 200: should respond with an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url', () => {
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then((response) => {
                expect(typeof response.body.articleObj).toBe("object");
                expect(Object.keys(response.body.articleObj)).toEqual(['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']);
                expect(response.body.articleObj).toEqual({
                    article_id: 2,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: 0,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
        });
        test('GET 400: should respond with a 400 error if given an invalid article_id prameter', () => {
            return request(app)
            .get('/api/articles/forklift')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid input');
            });
        });
        test('GET 404: should respond with a 404 if a valid `article_id` is given but the article_id does not exist in the database', () => {
            return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('No article found for article_id: 99999');
            });
        });
    });

    describe('/api/articles', () => {
        test('GET 200: should respond with an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count, (total count of all the comments with this article_id)', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(12);
                body.forEach((article) => {
                    expect(Object.keys(article)).toEqual(['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count']);
                });
            });
        });
        test('GET 200: array of article objects should be sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeSortedBy('created_at', {descending: true});
            });
        });
        test('GET 200: should not have a body property present on any of the article objects', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.forEach((article) => {
                    expect(Object.keys(article)).not.toEqual(['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count']);
                });
            });
        });
        test('GET 404: should respond with a 400 if given a bad request', () => {
            return request(app)
            .get('/api/articlez')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Endpoint does not exist");
            });
        });
    });
});