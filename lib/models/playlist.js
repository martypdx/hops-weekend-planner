const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const song = require('./song');

const schema = new Schema({
    title: String,
    songs: [song.schema],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Playlist', schema);
