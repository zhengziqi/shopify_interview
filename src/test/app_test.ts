
const appTest = require('../index');
var assert = require('assert');
const request = require('supertest');

describe('#test import prodct', () => {
    
    describe('#test server', () => {
        let server = appTest.listen(8888);
        it('#test GET /importPoroduct', async () => {
            let res = await request(server)
                .get('/importPoroduct?name=jewelery')
                .expect('Content-Type', /json/)
                .expect(200, /200/)
        });
    });
});

