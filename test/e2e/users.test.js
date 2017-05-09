const db = require('./util/_db');
const request = require('./util/_request');
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

    let keeley = {
        name: 'Keeley',
        email: 'keeleyhammond@me.com',
        password: 'hunter2',
        spotifyId: 'vertedinde',
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock']
    };

    let mississippiStudios = {
        name: 'Mississippi Studios',
        email: 'fakeUser2@fake.com',
        password: 'fakePassword',
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock'],
    };

    function saveUser(user) {
        return request
            .post('/users')
            .send(user)
            .then(res => res.body);
    }

    it('roundtrips a new user', () => {
        return saveUser(keeley)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                keeley = savedUser;
            })
            .then(() => {
                return request.get(`/users/${keeley._id}`);
            })
            .then(res => res.body)
            .then(gotUser => {
                assert.deepEqual(gotUser, keeley);
            });
    });

    it('saves another user as a friend', () => {
        return saveUser(mississippiStudios)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                mississippiStudios = savedUser;
                keeley.friends.push(mississippiStudios._id);
            })
            .then(() => {
                return request.put(`/users/${keeley._id}`)
                    .send(keeley)
                    .then(res => res.body)
                    .then(user => {
                        assert.deepEqual(user, keeley);
                    });
            });
    });

});