const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    },
    trailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trail',
      required: true
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leader',
      required: true
    },
    users: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Team", TeamSchema);
