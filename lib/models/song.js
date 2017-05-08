const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Song', schema);