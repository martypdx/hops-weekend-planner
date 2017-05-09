const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const song = require('./song');

const schema = new Schema({
    playlistTitle: {
        type: String,
        required: true
    },
    songs: [song.schema]
});

module.exports = mongoose.model('Playlist', schema);
