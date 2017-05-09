const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('songs api', () => {

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
        swipeLeft: false,
        spotifyId: '5DGJC3n9DS0Y9eY5ul9y0O'
    };
    let fakeSong2 = {
        title: 'Lame Song',
        artist: 'Train',
        swipeLeft: true,
        spotifyId: '5DGJC3n9DS0Y9eY5ul9y05'
    };
    let fakeSong3 = {
        title: 'List',
        artist: 'Kenrick Lamar',
        swipeLeft: false,
        spotifyId: '5DGJC3n9DS0Y9eY7ul9y0O'
    };

    function saveSong(song) {
        return request
            .post('/songs')
            .send(song)
            .then(res => res.body);
    }

    it('rountrips a new song', () => {
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
                    console.log('******songs', songs);
                    assert.include(songs, {
                        title: fakeSong.title,
                        artist: fakeSong.artist,
                        _id: fakeSong._id,
                        spotifyId: fakeSong.spotifyId,
                        swipeLeft: fakeSong.swipeLeft,
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

});
