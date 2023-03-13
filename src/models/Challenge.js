const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
