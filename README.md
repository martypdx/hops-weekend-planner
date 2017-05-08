# Hops: Music Community Database

MVP:
 - Log into Spotify using app
 - Models for users, songs, artists and (stretch) shows
 - 5 artists with 5 tracks each, with all data entered
 - 4 users with different user personas
 - Deployed to Heroku with TravisCI

 STRETCH GOALS:
 - Integrate Songkick or BandsInTown to add shows

### Sample Route Responses

Below are sample GET urls, as well as the objects returned:

/GET User:
```
https://api.spotify.com/v1/users/126171140/  //This is Ivy

{
  "display_name" : "Lila Ivy",
  "external_urls" : {
    "spotify" : "https://open.spotify.com/user/126171140"
  },
  "followers" : {
    "href" : null,
    "total" : 8
  },
  "href" : "https://api.spotify.com/v1/users/126171140",
  "id" : "126171140",
  "images" : [ {
    "height" : null,
    "url" : "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/16142623_10154302009612336_6657857095827464719_n.jpg?oh=1fc421a158b40eba3fa7e86311ac3fee&oe=5977016F",
    "width" : null
  } ],
  "type" : "user",
  "uri" : "spotify:user:126171140"
}
```

/GET Playlist:
```
https://api.spotify.com/v1/users/126171140/playlists?limit=1

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
```
https://api.spotify.com/v1/users/126171140/playlists/3AEDUXjNVitkRque3w1ObS/tracks?limit=1

{
  "href" : "https://api.spotify.com/v1/users/126171140/playlists/3AEDUXjNVitkRque3w1ObS/tracks?offset=0&limit=1",
  "items" : [ {
    "added_at" : "2017-04-16T00:56:20Z",
    "added_by" : {
      "external_urls" : {
        "spotify" : "http://open.spotify.com/user/126171140"
      },
      "href" : "https://api.spotify.com/v1/users/126171140",
      "id" : "126171140",
      "type" : "user",
      "uri" : "spotify:user:126171140"
    },
    "is_local" : false,
    "track" : {
      "album" : {
        "album_type" : "single",
        "artists" : [ {
          "external_urls" : {
            "spotify" : "https://open.spotify.com/artist/5DGJC3n9DS0Y9eY5ul9y0O"
          },
          "href" : "https://api.spotify.com/v1/artists/5DGJC3n9DS0Y9eY5ul9y0O",
          "id" : "5DGJC3n9DS0Y9eY5ul9y0O",
          "name" : "Marika Hackman",
          "type" : "artist",
          "uri" : "spotify:artist:5DGJC3n9DS0Y9eY5ul9y0O"
        } ],
        "available_markets" : [ "AR", "BO", "BR", "CA", "CL", "CO", "CR", "DO", "EC", "GT", "HN", "MX", "NI", "PA", "PE", "PY", "SV", "US", "UY" ],
        "external_urls" : {
          "spotify" : "https://open.spotify.com/album/1Iz7hSeb31b8OhKTsatM4p"
        },
        "href" : "https://api.spotify.com/v1/albums/1Iz7hSeb31b8OhKTsatM4p",
        "id" : "1Iz7hSeb31b8OhKTsatM4p",
        "images" : [ {
          "height" : 640,
          "url" : "https://i.scdn.co/image/121878286663bca557f750e10ebedf028447c678",
          "width" : 640
        }, {
          "height" : 300,
          "url" : "https://i.scdn.co/image/bb52aeb5070db4afbe70d016152e8701b5ef822f",
          "width" : 300
        }, {
          "height" : 64,
          "url" : "https://i.scdn.co/image/f6f250b5a3e4b0c440d1eb34f8686dca514b37ef",
          "width" : 64
        } ],
        "name" : "My Lover Cindy (Live from Marika's Bedroom)",
        "type" : "album",
        "uri" : "spotify:album:1Iz7hSeb31b8OhKTsatM4p"
      },
      "artists" : [ {
        "external_urls" : {
          "spotify" : "https://open.spotify.com/artist/5DGJC3n9DS0Y9eY5ul9y0O"
        },
        "href" : "https://api.spotify.com/v1/artists/5DGJC3n9DS0Y9eY5ul9y0O",
        "id" : "5DGJC3n9DS0Y9eY5ul9y0O",
        "name" : "Marika Hackman",
        "type" : "artist",
        "uri" : "spotify:artist:5DGJC3n9DS0Y9eY5ul9y0O"
      } ],
      "available_markets" : [ "AR", "BO", "BR", "CA", "CL", "CO", "CR", "DO", "EC", "GT", "HN", "MX", "NI", "PA", "PE", "PY", "SV", "US", "UY" ],
      "disc_number" : 1,
      "duration_ms" : 183533,
      "explicit" : false,
      "external_ids" : {
        "isrc" : "USSUB1720217"
      },
      "external_urls" : {
        "spotify" : "https://open.spotify.com/track/6WIvUw9VENt4dqF3epPtnV"
      },
      "href" : "https://api.spotify.com/v1/tracks/6WIvUw9VENt4dqF3epPtnV",
      "id" : "6WIvUw9VENt4dqF3epPtnV",
      "name" : "My Lover Cindy - Live from Marika's Bedroom",
      "popularity" : 19,
      "preview_url" : "https://p.scdn.co/mp3-preview/335769495e754a3740a6b09dabe235fba14acd04?cid=5a849416a63c44c1a4450c4bcdf2b527",
      "track_number" : 1,
      "type" : "track",
      "uri" : "spotify:track:6WIvUw9VENt4dqF3epPtnV"
    }
  } ],
  "limit" : 1,
  "next" : "https://api.spotify.com/v1/users/126171140/playlists/3AEDUXjNVitkRque3w1ObS/tracks?offset=1&limit=1",
  "offset" : 0,
  "previous" : null,
  "total" : 17
}
```
