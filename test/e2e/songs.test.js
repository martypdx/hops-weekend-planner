const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('Song Management API', () => {

    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request
            .get('/songs')
            .then(res => {
                const songs = res.body;
                assert.deepEqual(songs, []);
            });
    });

    let fakeSong1 = {
        title: 'Halo',
        artist: 'Beyonce',
        spotifyId: '5DGJC3n9DS0Y9eY5ul9y0O'
    };
    let fakeSong2 = {
        title: 'Lame Song',
        artist: 'Train',
        spotifyId: '5DGJC3n9DS0Y9eY5ul9y05'
    };
    let fakeSong3 = {
        title: 'Lust',
        artist: 'Kenrick Lamar',
        spotifyId: '5DGJC3n9DS0Y9eY7ul9y0O'
    };

    function saveSong(song) {
        return request
            .post('/songs')
            .send(song)
            .then(res => res.body);
    }

    it('roundtrips a new song', () => {
        return saveSong(fakeSong1)
            .then(savedSong => {
                assert.ok(savedSong._id, 'saved has id');
                fakeSong1 = savedSong;
            })
            .then(() => {
                return request.get(`/songs/${fakeSong1._id}`);
            })
            .then(res => res.body)
            .then(gotSong => {
                assert.deepEqual(gotSong, fakeSong1);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/songs/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('returns list of all songs', () => {
        return Promise.all([
            saveSong(fakeSong2),
            saveSong(fakeSong3)
        ])
            .then(savedSong => {
                fakeSong2 = savedSong[0];
                fakeSong3 = savedSong[1];
            })
            .then(() => request.get('/songs'))
            .then(res => res.body)
            .then(songs => {
                assert.equal(songs.length, 3);
                function test(fakeSong) {
                    assert.include(songs, {
                        title: fakeSong.title,
                        artist: fakeSong.artist,
                        _id: fakeSong._id,
                        spotifyId: fakeSong.spotifyId,
                        genre: fakeSong.genre,
                    });
                }

                test(fakeSong1);
                test(fakeSong2);
                test(fakeSong3);
            });
    });

    it('updates songs', () => {
        fakeSong3.title = 'updated fake song';
        return request.put(`/songs/${fakeSong3._id}`)
            .send(fakeSong3)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.title, 'updated fake song');
            });
    });

    it('deletes a song', () => {
        return request.delete(`/songs/${fakeSong3._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/songs'))
            .then(res => res.body)
            .then(songs => {
                assert.equal(songs.length, 2);
            });
    });

    it('deletes a non-existent song, returns removed false', () => {
        return request.delete(`/songs/${fakeSong3._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation falure', () => {
        return saveSong({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });

});
