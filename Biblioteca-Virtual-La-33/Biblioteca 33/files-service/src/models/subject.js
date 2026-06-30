import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model("Subject", SubjectSchema);