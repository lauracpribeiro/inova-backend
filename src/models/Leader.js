const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    trails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trail" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Leader", LeaderSchema);
