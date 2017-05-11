const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe.only('User Management Api', () => {

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
            .then(() => request.get('/users'))
            .then(res => res.body)
            .then(users => {
                assert.equal(users.length, 4);
                function testUser(userInput) {
                    assert.include(users, {
                        name: userInput.name,
                        email: userInput.email,
                        _id: userInput._id,
                        password: userInput.password,
                        faveArtists: userInput.faveArtists,
                        faveGenre: userInput.faveGenre,
                        friends: userInput.friends,
                        spotify: userInput.spotify
                    });
                }
                testUser(keeley);
                testUser(mississippiStudios);
                testUser(colssoccer12);
                testUser(Ivy);
            });
    });

    it('updates users', () => {
        keeley.name = 'Oprah';
        return request.put(`/users/${keeley._id}`)
            .send(keeley)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, 'Oprah');
            });
    });

    it('User and Song object relationship', () => {
        return request.patch(`/users/${keeley._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            });
    });

    it('deletes a user', () => {
        return request.delete(`/users/${keeley._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/users'))
            .then(res => res.body)
            .then(songs => {
                assert.equal(songs.length, 3);
            });
    });

    it('deletes a non-existent user, returns removed false', () => {
        return request.delete(`/users/${keeley._id}`)
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

// SPOTIFY ROUTES 
    it('/spotify/:id/friends returns songs by a user friends ', () => {
        const keeley = '59135c58ff28dd0011dfda9c';
        let arrSongs = []; //will store the array of tracks
        
        return request // will be changed to make this req loop for length of power users array
            .get(`/spotify/${keeley._id}/friends`)
            .then(res => {
                arrSongs = res.body; 
                assert.ok(arrSongs.length > 0);
            }); 
    });


});