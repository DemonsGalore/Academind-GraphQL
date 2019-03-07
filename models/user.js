const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'events',
    }
  ],
}, { timestamps: true });

module.exports = User = mongoose.model('users', userSchema);
