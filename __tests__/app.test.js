const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index.js');
const fs = require('fs/promises');
const endpointsFile = require('../endpoints.json');
const {selectCommentById} = require('../models/comments_model');

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
            .then(({body}) => {
                expect(typeof body.articleObj).toBe("object");
                expect(Object.keys(body.articleObj)).toEqual(['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']);
                expect(body.articleObj).toEqual({
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
        test('GET 400: should respond with a 400 error if given an invalid article_id parameter', () => {
            return request(app)
            .get('/api/articles/forklift')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid input');
            });
        });
        test('GET 404: should respond with a 404 if a valid `article_id` is given but the article_id does not exist in the database', () => {
            return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('No article found for article_id: 99999');
            });
        });
    });

    describe('GET /api/articles', () => {
        test('GET 200: should respond with an articles array of article objects, each of which should have author, title, article_id, topic, created_at, votes, article_img_url, comment_count properties; comment_count should be the total count of all the comments with this article_id', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(12);
                body.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    });
                });
            });
        });
        test('GET 200: the array of article objects should be sorted by the "created_at" date in descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeSortedBy('created_at', {descending: true});
            });
        });
        test('GET 200: there should not be a body property on any of the articles', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.forEach((article) => {
                    expect(article).not.toHaveProperty('body');
                });
            });
        });
        test('GET 404: should respond with a 404 if given a bad request', () => {
            return request(app)
            .get('/api/articlez')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Endpoint does not exist");
            });
        });
    });

    describe('GET /api/articles/:article_id/comments', () => {
        test('GET 200: should respond with an array of all the comments for a given article_id. Each comment object needs to include properties of comment_id, votes, created_at, author, body and article_id', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(2)
                body.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    });
                });
            })
        });
        test('GET 200: all comments in the response should be in descending order according to the created_at date (i.e. most recent comment first, oldest comment last)', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeSortedBy('created_at', {descending: true})
            })
        });
        test('GET 200: should respond with a 200 when the article_id exists but there are no comments associated with it', () => {
            return request(app)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.msg).toEqual("There are no comments associated with this article!")
            });
        });
        test('GET 400: should respond with a 400 error if given an invalid article_id prameter', () => {
            return request(app)
            .get('/api/articles/forklift/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid input');
            });
        });
        test('GET 404: should respond with a 404 if a valid `article_id` is given but the article_id does not exist in the database', () => {
            return request(app)
            .get('/api/articles/99999/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('No article found for article_id: 99999');
            });
        });
    });

    describe('GET /api/articles?topic', () => {
        test('GET 200: should respond with an array of all the articles that have the topic given in the query', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body)).toBe(true);
                expect(body.length).toBe(11);
            });
        });
        test('GET 200: each article object in the array should have author, title, article_id, topic, created_at, votes, article_img_url, comment_count properties; comment_count should be the total count of all the comments with this article_id', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                body.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    });
                });
            });
        });
        test('GET 200: the array of article objects should be sorted by the "created_at" date in descending order', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeSortedBy('created_at', {descending: true});
            });
        });
        test('GET 200: there should not be a body property on any of the articles', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                body.forEach((article) => {
                    expect(article).not.toHaveProperty('body');
                });
            });
        });
        test('GET 404: should respond with a 404 if given a bad request', () => {
            return request(app)
            .get('/api/articlez?topic=cats')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Endpoint does not exist");
            });
        });
        test('GET 404: should respond with a 404 if a valid `topic` query is given in the endpoint, but there are no articles with that topic values in the database ', () => {
            return request(app)
            .get('/api/articles?topic=peanutbutter')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("No article found for topic: peanutbutter");
            }); 
        });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('POST 201: should take a username and body property on the request body object and responds with a new comment, when a new comment is successfully added to the database', () => {
        const postBody = {
            username: 'lurker',
            body: 'The greatest glory in living lies not in never falling, but in rising every time we fall'
        }
        return request(app)
        .post('/api/articles/7/comments')
        .expect(201)
        .send(postBody)
        .then(({body}) => {
            expect(typeof body).toBe("object");
            expect(body).toMatchObject({
                comment_id: 19,
                votes: 0,
                author: 'lurker',
                body: 'The greatest glory in living lies not in never falling, but in rising every time we fall',
                article_id: 7
            })
            expect(body).toHaveProperty('created_at');
        });
    });
    test('POST 201: should ignore any additional properties given on the request body', () => {
        const postBody = {
            username: 'lurker',
            body: 'The greatest glory in living lies not in never falling, but in rising every time we fall',
            favesnack: 'peanutbutter'
        }
        return request(app)
        .post('/api/articles/7/comments')
        .expect(201)
        .send(postBody)
        .then(({body}) => {
            expect(typeof body).toBe("object");
            expect(body).toMatchObject({
                comment_id: 19,
                votes: 0,
                author: 'lurker',
                body: 'The greatest glory in living lies not in never falling, but in rising every time we fall',
                article_id: 7
            })
            expect(body).toHaveProperty('created_at');
        });
    });
    test('POST 400: should respond with a 400 if the post body object does not have correct username and/or body properties with values of the correct datatype', () => {
        const postBody = {
            faveFood: "peanut butter",
            body: "The greatest glory in living lies not in never falling, but in rising every time we fall"
        }
        return request(app)
        .post('/api/articles/7/comments')
        .expect(400)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input')
        });
    });
    test('POST 400: should respond with a 400 if the post body object has username and body properties but the values are of an incorrect datatype', () => {
        const postBody = {
            username: 3,
            body: ["The greatest glory in living lies not in never falling, but in rising every time we fall"]
        }
        return request(app)
        .post('/api/articles/7/comments')
        .expect(400)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input')
        });
    });
    test('POST 400: should respond with a 400 error if given an invalid article_id parameter in the endpoint', () => {
        const postBody = {
            username: "lurker",
            body: "The greatest glory in living lies not in never falling, but in rising every time we fall"
        }
        return request(app)
        .post('/api/articles/forklift/comments')
        .expect(400)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input');
        });
    });
    test('POST 404: should respond with a 404 if a valid `article_id` is given in the endpoint, but the article_id does not exist in the database', () => {
        const postBody = {
            username: "lurker",
            body: "The greatest glory in living lies not in never falling, but in rising every time we fall"
        }
        return request(app)
        .post('/api/articles/99999/comments')
        .expect(404)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('No article found for article_id: 99999');
        });
    });
    test('POST 404: should respond with a 404 if a valid username is given, but the corresponding user does not exist in the database', () => {
        const postBody = {
            username: "nrmandela",
            body: "The greatest glory in living lies not in never falling, but in rising every time we fall"
        }
        return request(app)
        .post('/api/articles/7/comments')
        .expect(404)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('User nrmandela not found');
        });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH 200: should update an article\'s vote property (positive value) on the requst body', () => {
        const postBody = {inc_votes: 20}
        return request(app)
        .patch('/api/articles/3') 
        .expect(200)
        .send(postBody)
        .then(({body}) => {
            expect(typeof body).toBe("object");
            expect(body).toEqual({
                article_id: 3,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 20,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            });
       });
    });
    test('PATCH 200: should successfully update number of votes if given a negative value for inc_votes property on the request body object', () => {
        const postBody = {inc_votes: -20}
        return request(app)
        .patch('/api/articles/3') 
        .expect(200)
        .send(postBody)
        .then(({body}) => {
            expect(typeof body).toBe("object");
            expect(body).toEqual({
                article_id: 3,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: -20,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            });
       });
    });
    test('PATCH 200: should ignore additional properties on the request body object', () => {
        const postBody = {inc_votes: -20, favfood: 'peanutbutter'}
        return request(app)
        .patch('/api/articles/3') 
        .expect(200)
        .send(postBody)
        .then(({body}) => {
            expect(typeof body).toBe("object");
            expect(body).toEqual({
                article_id: 3,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: -20,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            });
       });
    });
    test('PATCH 400: should respond with a 400 error if given an invalid article_id prameter', () => {
        const postBody = {inc_votes: 20}
        return request(app)
        .patch('/api/articles/forklift')
        .expect(400)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input');
        });
    });
    test('PATCH 200: should respond with a 200 and return the original single article object if not given an object with inc_votes property', () => {
        const postBody = {}
        return request(app)
        .patch('/api/articles/3')
        .expect(200)
        .send(postBody)
        .then(({body}) => {
            expect(body).toEqual({                article_id: 3,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 0,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            });
        });
    });
    test('PATCH 400: should respond with a 400 error if given an invalid inc_votes value', () => {
        const postBody = {inc_votes: 'peanutbutter'}
        return request(app)
        .patch('/api/articles/3')
        .expect(400)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input');
        });
    });
    test('PATCH 404: should respond with a 404 if a valid `article_id` is given but the article_id does not exist in the database', () => {
        const postBody = {inc_votes: 20}
        return request(app)
        .patch('/api/articles/99999')
        .expect(404)
        .send(postBody)
        .then(({body}) => {
            expect(body.msg).toBe('No article found for article_id: 99999');
        });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE 204: should respond with a 204 and no content when a comment has successfully been deleted according to the given comment_id', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({})
        });
    });
    test('GET 400: should respond with a 400 error if given an invalid comment_id prameter', () => {
        return request(app)
        .delete('/api/comments/forklift')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input');
        });
    });
    test('GET 404: should respond with a 404 if a valid `comment_id` is given but the comment_id does not exist in the database', () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No comment found for comment_id: 9999');
        });
    });
});

describe('GET /api/users/', () => {
    test('GET 200: should return an array of user objects, each with 3 properties: username, name and avatar url', () => {
        return request(app)
        .get('/api/users/')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(4);
            expect(body).toEqual([
                {
                  username: 'butter_bridge',
                  name: 'jonny',
                  avatar_url:
                    'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                },
                {
                  username: 'icellusedkars',
                  name: 'sam',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                },
                {
                  username: 'rogersop',
                  name: 'paul',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                },
                {
                  username: 'lurker',
                  name: 'do_nothing',
                  avatar_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                }
            ]);
        });
    });
    test('GET 404: should respond with a 404 and error message if given an endpoint that does not exist', () => {
        return request(app)
        .get('/api/userz')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Endpoint does not exist");
        });
    });
});

