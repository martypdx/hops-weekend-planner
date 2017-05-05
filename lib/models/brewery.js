const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beer = require('./beer');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: { type: String },
    location: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    neighborhood: {
        type: String,
        enum: ['Kerns', 'Buckman', 'Woodlawn', 'Industrial SE', 'Irvington', 'Pearl', 'NW', 'NoPo', 'Mississippi', 'Alberta', 'Burbs']
    },
    food: {
        hasFood: {
            type: Boolean,
            required: true
        },
        type: String,
        enum: ['appetizers only', 'full kitchen'],
    },
    outdoor: {
        type: Boolean,
        required: true
    },
    dogFriendly: { type: Boolean },
    beer: [beer.schema]
});

module.exports = mongoose.model('Brewery', schema);