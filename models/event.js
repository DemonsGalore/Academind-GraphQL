const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
}, { timestamps: true });

module.exports = Event = mongoose.model('events', eventSchema);
