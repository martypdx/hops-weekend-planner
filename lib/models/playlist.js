const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const song = require('./song');

const schema = new Schema({
    user: { type: Schema.Types.ObjectId },
    title: {
        type: String,
        // required: true
    },
    songs: [song.schema]
});

module.exports = mongoose.model('Playlist', schema);
