const Router = require('express').Router;
const router = Router();

const request = require('request'); // "Request" library
var querystring = require('querystring');

const User = require('../models/user');
const ensureAuth = require('../auth/ensure-auth')();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

/**
 * NOTE: MUCH OF THE BELOW WAS DRAWN FROM SPOTIFY'S API
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';
const userKey = 'user_id';

router.get('/login', ensureAuth, function (req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.cookie(userKey, req.user.id);

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-modify-public playlist-modify-private user-follow-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', function (req, res, next) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        const userId = req.cookies[userKey];
        res.clearCookie(userKey);
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    /* eslint-disable */
                    console.log(body);
                    User.findById(userId)
                        .then(user => {
                            user.spotify = {
                                spotify_id: body.id,
                                access_token,
                                refresh_token
                            };
                            return user.save();
                        })
                        .catch(next);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

router.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});



//     //run through all friends ids and grab their Spotify id (user.spotify[spotify_id])
//     //Run query to grab their top 10 most recently played tracks
//     //Populate array

router
    .get('/:id/friends', (req, res, next) => {
        let id = req.params.id;
        let tracksArr = [];
        let friendsArray = [];
        User.findById(id)
            .lean()
            .populate({
                path: 'friends',
                select: 'spotify'
            })
            .then(user => {
                console.log('USERS FRIENDS', user.friends);
                friendsArray = user.friends;
            })
            .then(() => {
                friendsArray.forEach(friend => {
                    var authOptions = {
                        url: 'https://api.spotify.com/v1/me/top/tracks?limit=20',
                        headers: {
                            'Authorization': 'Bearer ' + friend.spotify.access_token
                        }
                    };

                    request.get(authOptions, (error, response) => {
                        let songs = JSON.parse(response.body);
                        for (var i = 0; i < songs.items.length; i++) {
                            let obj = {
                                title: songs.items[i].name,
                                album: songs.items[i].album.name,
                                // artist: songs.items[i].album.artists[0].name,
                                spotifyId: songs.items[i].id,
                            };
                            tracksArr.push(obj);

                        }
                        console.log(tracksArr);
                        res.send(tracksArr);
                    });

                })
                
            });

        // request.get(`https://api.spotify.com/v1/artists/${ToveLoId}/top-tracks?country=US`, (error, songs, next) => {
        //     let songsy = JSON.parse(songs.body);
        //     songsy.tracks.forEach(title => {
        //         let obj = {
        //             title: title.name,
        //             album: title.album.name,
        //             artist: title.album.artists[0].name,
        //             spotifyId: title.id,
        //         };
        //         tracksArr.push(obj);
        //     });
        //     console.log(tracksArr)
        //     res.send(songsy);
        // });

    });


module.exports = router;