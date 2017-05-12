const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('Playlist Management API', () => {

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

    it('initial /GET returns empty playlist', () => {
        return request
            .get('/playlists')
            .set('Authorization', token)
            .then(res => {
                const playlists = res.body;
                assert.ok(playlists);
            });
    });

    let testSong = {
        title: 'Real Love',
        album: 'Masterpiece',
        spotifyId: '3mUuD7ec0lWqwSZnTiQ58J',
        _id: '5914d7c6183e9dd8803f7e8e',
        genre: [],
        recommendedFrom: {
            id: '59135df1ff28dd0011dfda9e',
            name: 'Ivy'
        }
    };

    let fakePlaylist1 = {
        title: 'fake Playlist 1',
        songs: [{ title: 'halo', artist: 'Beyonce', spotifyId: '5DGJC3n9DS0Y9eY5ul8y0O' }, { title: 'Lame Song', artist: 'Train', spotifyId: '5DGJC3n9DS0Y9eY5ul9y0O' }],
        user: 'fake user id'
    };
    let fakePlaylist2 = {
        title: 'fake Playlist 2',
        songs: [{ title: 'halo', artist: 'Beyonce', spotifyId: '5DGJC3n7DS0Y9eY5ul9y0O' }, { title: 'Lust', artist: 'Kendrick Lamar', spotifyId: '5DGJC3n9DS0T9eY5ul9y0O' }],
        user: 'fake user id'
    };
    let fakePlaylist3 = {
        title: 'fake Playlist 3',
        songs: [{ title: 'Lame Song', artist: 'Train', spotifyId: '5DGJD3n9DS0Y9eY5ul9y0O' }, { title: 'Lust', artist: 'Kendrick Lamar', spotifyId: '5DGJC3n9DS0K9eY5ul9y0O' }],
        user: 'fake user id'
    };


    function savePlaylist(playlist) {
        return request
            .post('/playlists')
            .send(playlist)
            .set('Authorization', token)
            .then(res => res.body);
    }

    function saveSong(testSong) {
        return request
            .post('/songs')
            .send(testSong)
            .set('Authorization', token)
            .then(res => res.body);
    }

    it('roundtrips a new playlist', () => {
        saveSong(testSong);
        return savePlaylist(fakePlaylist1)
            .then(savedPlaylist => {
                assert.ok(savedPlaylist._id, 'saved has id');
                fakePlaylist1 = savedPlaylist;
            })
            .then(() => {
                return request.get(`/playlists/${fakePlaylist1._id}`)
                    .set('Authorization', token);
            })
            .then(res => res.body)
            .then(gotPlaylist => {
                assert.deepEqual(gotPlaylist, fakePlaylist1);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/playlists/${fakeId}`)
            .set('Authorization', token)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('returns list of all playlists', () => {
        return Promise.all([
            savePlaylist(fakePlaylist2),
            savePlaylist(fakePlaylist3)
        ])
            .then(savedPlaylist => {
                fakePlaylist2 = savedPlaylist[0];
                fakePlaylist3 = savedPlaylist[1];
            })
            .then(() => {
                return request.get('/playlists')
                    .set('Authorization', token);
            })
            .then(res => res.body)
            .then(playlists => {
                assert.equal(playlists.length, 3);
            });
    });
});

