const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('hops api', () => {

    before(db.drop);

    it('/spotify/:id returns an array of songs by a user', () => {
        //will change based on the actual powerUsers we select
        const powerUsers = ['WhiteOwlStudio', 'Wiz Khalifa', 'Daft Punk', 'Rolling Stones', 'Migos'];
        let arrSongs = []; //will store the array of tracks
        
        return request // will be changed to make this req loop for length of power users array
            .get(`/spotify/${powerUsers[2]}`)
            .then(res => {
                arrSongs = res.body; 
                assert.ok(arrSongs.length > 0);
            }); 
    });
});