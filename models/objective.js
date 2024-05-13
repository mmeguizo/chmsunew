const mongoose = require("mongoose");

const { Schema } = mongoose;

const objectivesSchema = new Schema({
  id: { type: String, required: true, unique: true },
  department: {
    type: String,
    required: true,
    lowercase: true,
  },
  user: {
    type: String,
    required: true,
    lowercase: true,
  },
  strategic_objective: { type: String, required: true },
  functional_objective: { type: String, required: true },
  performance_indicator: { type: String, required: true },
  target: { type: String, required: true },
  formula: { type: String, required: true },
  programs: { type: String, required: true },
  responsible_persons: { type: String, required: true },
  clients: { type: String, required: true },
  timetable: { type: String, required: true },
  frequency_monitoring: { type: String, required: true },
  data_source: { type: String, required: true },
  budget: { type: String, required: true },
  date_added: { type: Date, required: true, default: Date.now },
  createdBy: { type: String, required: true },
  updateby: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "active" },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Objectives", objectivesSchema);
