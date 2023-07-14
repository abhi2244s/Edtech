const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
