const request = require('request-promise');
var querystring = require('querystring');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

const generateRandomString = function(length) {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const AUTH_URI = 'https://accounts.spotify.com/api/token';
const ME_URL = 'https://api.spotify.com/v1/me';

const headers = {
    Authorization: 'Basic ' +
    new Buffer(client_id + ':' + client_secret).toString('base64')
}

function getOptions(url, token) {
    return {
        url,
        headers: { Authorization: `Bearer ${token}` },
        json: true
    };
}

module.exports = {
    getTokens(code) {
        const authOptions = {
            url: AUTH_URI,
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers,
            json: true
        };

        return request.post(authOptions);
    },

    refreshToken(refresh_token) {
        // requesting access token from refresh token
        const authOptions = {
            url: AUTH_URI,
            headers,
            form: {
                grant_type: 'refresh_token',
                refresh_token
            },
            json: true
        };

        return request
            .post(authOptions)
            .then(result => result.access_token);
    },
    
    getUser(token) {
        return request.get(ME_URL, token);
    },
    
    getTopSongs(token) {
        return request.get(`${ME_URL}/top/tracks?limit=20`, token)
    }
}