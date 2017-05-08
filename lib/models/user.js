const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: { type: String },
    password: {
        type: String,
        required: true,
    },
    location: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    recommended: [{ type: String }],
    faveBands: [{ type: String }],
    faveSongs: [{ type: String }],
    friendsBands: [{ type: String }],
    friendsSongs: [{ type: String }],
    shows: [{ type: String }],
});

module.exports = mongoose.model('User', schema);