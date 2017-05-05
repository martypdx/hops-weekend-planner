const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    faveBeer: [{ type: String }],
    lastBeer: [{ type: String }],
    faveBreweries: [{ type: String }],
    breweryWishlist: [{ type: String }],

});

module.exports = mongoose.model('User', schema);