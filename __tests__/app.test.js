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
    test('GET: 200: should respond with an array of topic objects, each of which should have the following properties: slug, description', () => {
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

describe('/api', () => {
    test('GET 200: should respond with an object describing all the available endpoints on the nc news API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpointsFile);
        });
    });
});

