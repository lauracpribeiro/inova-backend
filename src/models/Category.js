const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }]
  }
);

module.exports = mongoose.model("Category", CategorySchema);
