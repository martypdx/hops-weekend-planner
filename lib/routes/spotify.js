const Router = require('express').Router;
const router = Router();

const request = require('request'); // "Request" library
const rp = require('request-promise'); // "Request" library promisified
var querystring = require('querystring');

const User = require('../models/user');
const Song = require('../models/song');
const ensureAuth = require('../auth/ensure-auth')();

const spotify = require('../spotify-api');

var generateRandomString = function(length) {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';
const userKey = 'user_id';

router.get('/login', ensureAuth, function(req, res) {
    const state = generateRandomString(16);
    // Probably can just use user ID as key
    res.cookie(userKey, req.user.id);

    // your application requests authorization
    var scope =
        'user-read-private user-read-email user-top-read user-read-recently-played playlist-modify-public playlist-modify-private user-follow-read';
    res.redirect(
        'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            })
    );
});

router.get('/callback', function(req, res, next) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(
            '/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                })
        );
    } else {
        const userId = req.cookies[userKey];
        res.clearCookie(userKey);
        res.clearCookie(stateKey);

        spotify
            .getTokens(code)
            .then(({ access_token, refresh_token }) => {
                return spotify.getUser(access_token).then(({ id }) => {
                    return { id, access_token, refresh_token };
                });
            })
            .then(({ id, access_token, refresh_token }) => {
                User.findById(userId).then(user => {
                    user.spotify = {
                        spotify_id: id,
                        access_token,
                        refresh_token
                    };
                    return user.save();
                });
            })
            .then(() => {
                res.redirect(
                    '/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    })
                );
            })
            .catch(err => {
                res.redirect(
                    '/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        })
                );
            });


    }
});

function refreshFriend(friend) {
    // requesting access token from refresh token
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: 'Basic ' +
                new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: friend.spotify.refresh_token
        },
        json: true
    };

    return rp
        .post(authOptions)
        .then(result => result.access_token)
        .then(access_token => {
            friend.spotify.access_token = access_token;
            return friend;
        });
}

function refreshFriends(friends) {
    const refreshedPromises = friends.map(refreshFriend);
    return Promise.all(refreshedPromises);
}

function setHeaders(spotifyToken) {
    return {
        url: 'https://api.spotify.com/v1/me/top/tracks?limit=20',
        headers: {
            Authorization: 'Bearer ' + spotifyToken
        }
    };
}

function makeSong(friend, song) {
    return new Song({
        title: song.name,
        artist: song.artists[0].name,
        album: song.album.name,
        albumId: song.album.id,
        spotifyId: song.id,
        spotifyUri: song.uri,
        recommendedFrom: {
            id: friend._id,
            name: friend.name
        }
    });
}

// don't allow users more permissions than the should have
router.get('/:id/friendsrec', (req, res, next) => {
    let id = req.params.id;
    let name = '';
    User.findById(id)
        .lean()
        .populate({
            path: 'friends',
            select: 'spotify name'
        })
        .then(user => {
            name = user.name;
            return refreshFriends(user.friends);
        })
        .then(friends => {
            const promises = friends.map(friend => {
                return rp
                    .get(setHeaders(friend.spotify.access_token))
                    .then(response => JSON.parse(response))
                    .then(songs => {
                        return songs.items.map(song => makeSong(friend, song));
                    });
            });
            return Promise.all(promises);
        })
        .then(songs => {
            const combinedSongs = songs.reduce((a, b) => a.concat(b));
            res.send(combinedSongs);
        })
        .catch(next);
});

module.exports = router;
