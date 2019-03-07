const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'events',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  }
}, { timestamps: true });

module.exports = Booking = mongoose.model('bookings', bookingSchema);
