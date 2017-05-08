# Hops: Music Community Database

MVP:
 - Log into Spotify using app
 - 
 - Models for users, songs, artists and (stretch) shows
 - 5 artists with 5 tracks each, with all data entered
 - 4 users with different user personas
 - Deployed to Heroku with TravisCI

 STRETCH GOALS:
 - Integrate Songkick or BandsInTown to add shows

### Sample Route Responses

/GET User:

/GET Playlist:
```
https://api.spotify.com/v1/users/126171140/playlists/

{
  "href" : "https://api.spotify.com/v1/users/126171140/playlists?offset=0&limit=1",
  "items" : [ {
    "collaborative" : false,
    "external_urls" : {
      "spotify" : "http://open.spotify.com/user/126171140/playlist/6UhgDBPnm44HDfIBbgbEo3"
    },
    "href" : "https://api.spotify.com/v1/users/126171140/playlists/6UhgDBPnm44HDfIBbgbEo3",
    "id" : "6UhgDBPnm44HDfIBbgbEo3",
    "images" : [ ],
    "name" : "HARDLY ART",
    "owner" : {
      "external_urls" : {
        "spotify" : "http://open.spotify.com/user/126171140"
      },
      "href" : "https://api.spotify.com/v1/users/126171140",
      "id" : "126171140",
      "type" : "user",
      "uri" : "spotify:user:126171140"
    },
    "public" : true,
    "snapshot_id" : "mB1T5EVaHqz2SaG+UptfX2u55hmyltommKj7ltre0ixwNixCCPjT0R9r7HNNiRjC",
    "tracks" : {
      "href" : "https://api.spotify.com/v1/users/126171140/playlists/6UhgDBPnm44HDfIBbgbEo3/tracks",
      "total" : 0
    },
    "type" : "playlist",
    "uri" : "spotify:user:126171140:playlist:6UhgDBPnm44HDfIBbgbEo3"
  } ],
  "limit" : 1,
  "next" : "https://api.spotify.com/v1/users/126171140/playlists?offset=1&limit=1",
  "offset" : 0,
  "previous" : null,
  "total" : 23
}
```

/GET Track:



