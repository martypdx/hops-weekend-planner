const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('User Management API', () => {

    before(db.drop);

    let token = '';

    //create a token!
    before(() => {
        return request.post('/auth/signup')
            .send({
                name: 'Belinda',
                email: 'keeley@thedrawplay.com',
                password: 'banana',
                spotify: {
                    spotify_id: 'vertedinde',
                    access_token: '',
                    refresh_token: ''
                }
            })
            .then(res => {
                let responses = res.redirects[0].split('=');
                token = responses[1];
            });
    });

    it('initial /GET', () => {
        return request
            .get('/users')
            .set('Authorization', token)
            .then(res => {
                const users = res.body;
                assert.ok(users);
            });
    });

    let keeley = {
        name: 'Keeley',
        email: 'keeleyhammond@me.com',
        password: 'hunter2',
        spotify: {
            spotify_id: 'vertedinde',
            access_token: '',
            refresh_token: ''
        },
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock']
    };

    let mississippiStudios = {
        name: 'Mississippi Studios',
        email: 'fakeUser3@fake.com',
        password: 'fakePassword',
        spotify: {
            spotify_id: 'mississippipstudios',
            access_token: '',
            refresh_token: ''
        },
        friends: [],
        faveGenre: ['opera', 'afrobeat', 'alt-rock'],
    };


    let Ivy = {
        name: 'Ivy',
        email: 'ivy@fake.com',
        password: 'fakePassword',
        spotify: {
            spotify_id: '126171140',
            access_token: '',
            refresh_token: ''
        },
        friends: [],
        faveGenre: ['opera', 'afrobeat', 'alt-rock'],
    };


    let colssoccer12 = {
        name: 'Colin Hammond',
        email: 'fakeUser3@fake.com',
        password: 'fakePassword',
        spotify: {
            spotify_id: 'colssoccer12',
            access_token: '',
            refresh_token: ''
        },
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock'],
    };

    function saveUser(user) {
        return request
            .post('/users')
            .send(user)
            .set('Authorization', token)
            .then(res => res.body);
    }

    it('roundtrips a new user', () => {
        return saveUser(keeley)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                keeley = savedUser;
            })
            .then(() => {
                return request.get(`/users/${keeley._id}`)
                    .set('Authorization', token);
            })
            .then(res => res.body)
            .then(gotUser => {
                assert.deepEqual(gotUser, keeley);
            });
    });

    it('saves a second user', () => {
        return saveUser(colssoccer12)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                colssoccer12 = savedUser;
            });
    });

    it('saves two other users as friends', () => {
        return saveUser(mississippiStudios)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                mississippiStudios = savedUser;
                keeley.friends = [mississippiStudios._id, colssoccer12._id];
            })
            .then(() => {
                return request.put(`/users/${keeley._id}`)
                    .send(keeley)
                    .set('Authorization', token)
                    .then(res => res.body)
                    .then(user => {
                        assert.deepEqual(user, keeley);
                    });
            });

    });

    it('returns list of all users', () => {
        return saveUser(Ivy)
            .then(savedUser => {
                Ivy = savedUser;
            })
            .then(() => {
                return request.get('/users')
                    .set('Authorization', token);
            })
            .then(res => res.body)
            .then(users => {
                assert.equal(users.length, 5);
            });
    });

    it('updates users', () => {
        keeley.name = 'Oprah';
        return request.put(`/users/${keeley._id}`)
            .send(keeley)
            .set('Authorization', token)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, 'Oprah');
            });
    });

    it('deletes a user', () => {
        return request.delete(`/users/${keeley._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            });
    });

    it('deletes a non-existent user, returns removed false', () => {
        return request.delete(`/users/${keeley._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation falure', () => {
        return saveUser({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });
});