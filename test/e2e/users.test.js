const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('hops api', () => {

    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request
            .get('/users')
            .then(res => {
                const users = res.body;
                assert.deepEqual(users, []);
            });
    });

    let fakeUser1 = {
        name: 'fake',
        email: 'fakeUser1@fake.com',
        password: 'fakePassword',
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock']

    };
    // let fakeUser2 = {
    //     name: 'fake2',
    //     email: 'fakeUser2@fake.com',
    //     password: 'fakePassword',
    //     friends: ['fakeUser1'],
    //     faveGenre: ['acoustic', 'afrobeat', 'alt-rock'],
    // };

    // let fakeUser3 = {
    //     name: 'fake3',
    //     email: 'fakeUser3@fake.com',
    //     password: 'fakePassword',
    //     friends: ['ivy', 'chris'],
    //     faveGenre: ['acoustic', 'afrobeat', 'alt-rock'],
    // };

    function saveUser(user) {
        return request
            .post('/users')
            .send(user)
            .then(res => res.body);
    }

    it('roundtrips a new user', () => {
        return saveUser(fakeUser1)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                fakeUser1 = savedUser;
            })
            .then(() => {
                return request.get(`/users/${fakeUser1._id}`);
            })
            .then(res => res.body)
            .then(gotUser => {
                assert.deepEqual(gotUser, fakeUser1);
            });
    });

    it.skip('saves another user as a friend', () => {});


});