const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema(
  {
    response: { type: String, required: true },
    stage: { type: Number, required: true },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    trailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trail',
      required: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Response", ResponseSchema);
