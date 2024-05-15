const mongoose = require("mongoose");
const Objectives = require("../models/objective");

const { Schema } = mongoose;

// Define the schema for the Goals model
const goalsSchema = new Schema({
  id: { type: String, required: true, unique: true }, // Unique identifier for the goal
  goals: {
    type: String,
    required: true,
    lowercase: true,
  }, // The goal description
  budget: { type: Number, required: true }, // The total budget of the goal
  objectives: [
    {
      objectivesId: { type: String },
    },
  ], // The objectives associated with the goal
  date_added: { type: Date, required: true, default: Date.now }, // The date the goal was added
  createdBy: { type: String }, // The ID of the user who created the goal
  createdAt: { type: Date, default: Date.now }, // The date the goal was created
  updatedBy: { type: String }, // The ID of the user who last updated the goal
  updateDate: { type: Date }, // The date the goal was created
  deleted: { type: Boolean, default: false }, // Indicates if the goal is deleted
});

goalsSchema.post("updateOne", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate.deleted) {
    await Objectives.updateMany(
      { id: { $in: docToUpdate.objectives.map((obj) => obj.objectivesId) } },
      { $set: { deleted: true } }
    );
  }
});

// Export the Goals model
module.exports = mongoose.model("Goals", goalsSchema);
