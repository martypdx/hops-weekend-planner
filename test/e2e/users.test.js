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
        faveGenre: ['opera', 'afrobeat', 'alt-rock'],
    };

    let Ivy = {
        name: 'Ivy',
        email: 'ivy@fake.com',
        password: 'fakePassword',
        friends: [],
        faveGenre: ['opera', 'afrobeat', 'alt-rock'],
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

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/users/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
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

    it('returns list of all users', () => {
        return saveUser(Ivy)
            .then(savedUser => {
                Ivy = savedUser[0];
            })
            .then(() => request.get('/users'))
            .then(res => res.body)
            .then(users => {
                assert.equal(users.length, 3);
                function test(fakeUser) {
                    assert.include(users, {
                        name: fakeUser.name,
                        artist: fakeUser.artist,
                        _id: fakeUser._id,
                        spotifyId: fakeUser.spotifyId,
                        genre: fakeUser.genre,
                    });
                }

                test(keeley);
                test(mississippiStudios);
                test(Ivy);
            });
    });




});