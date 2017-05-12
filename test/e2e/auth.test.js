const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('User Management (Authentication)', () => {

    before(db.drop);

    const user = {
        name: 'Morgan',
        email: 'spotifytest@gmail.com',
        password: 'hunter2',
    };

    let token = '';

    describe('Sign Up / ', () => {

        it('signup happy path', () => {
            return request.post('/auth/signup')
                .send(user)
                .then(res => {
                    token = res.body.token;
                    assert.ok(token = res.body.token);
                });
        });

        it.skip('signup and get Spotify token/id', () => {
            return request.post('/auth/signup')
                .send(user)
                .then(res => {
                    token = res.body.token;
                    assert.ok(token = res.body.token);
                });
        });

    });

    describe('Sign In', () => {

        it('signin happy path', () => {
            return request.post('/auth/signin')
                .send(user)
                .then(res => assert.ok(res.body.token));
        });

        it('token is valid', () => {
            return request.get('/auth/verify')
                .set('Authorization', token)
                .then(res => {
                    assert.ok(res.body);
                });
        });

    });
});