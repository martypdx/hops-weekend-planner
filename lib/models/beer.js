const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    require: true
  },
  brewery: {
    type: Schema.Types.ObjectId,
    ref: 'Brewery',
    required: true
  },
  style: {
    type: String,
    enum: ['IPA', 'sour', 'stout', 'seasonal', 'pilsner', 'lager', 'fruity', 'kolsch', 'Belgian', 'pale ale', 'porter', 'Mexican beer', 'Oktoberfest', 'cider', 'saison', 'farmhouse']
  },
  abv: { type: Number }
});

module.exports = mongoose.model('Beer', schema);