import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({

  title: String,

  description: String,

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },

  fileUrl: String,

  originalName: String,

  sizeBytes: Number,

  mimeType: String,

  uploadedBy: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  reason: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("File", FileSchema);