const mongoose = require("mongoose");

const { Schema } = mongoose;

const departmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  department: {
    type: String,
    required: true,
    lowercase: true,
  },
  status: { type: String, default: "active" },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Department", departmentSchema);
