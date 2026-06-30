import axios from "axios";
import File from "../models/file.js";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:3001/IA-OCR-Service/v1";

const INTERNAL_SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY;

export const uploadFile = async (req, res, next) => {
  try {

    const { title, description, subject } = req.body;

    const file = await File.create({
      title,
      description,
      subject,
      fileUrl: req.file.path,
      originalName: req.file.originalname,
      sizeBytes: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id
    });

    try {

      await axios.post(
        `${AI_SERVICE_URL}/pipeline/process-file`,
        {
          fileId: file._id,
          uploadedBy: file.uploadedBy,
          fileURL: file.fileUrl,
          title: file.title,
          originalName: file.originalName
        },
        {
          headers: { "x-internal-key": INTERNAL_SERVICE_KEY }
        }
      );

    } catch (error) {

      console.log("AI service error:", error.message);

    }

    res.json(file);

  } catch (error) {

    next(error);

  }
};

export const getFiles = async (req, res, next) => {
  try {

    const { status, subject, q } = req.query;

    // Construir el filtro dinamicamente solo con los params presentes
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (subject) {
      filter.subject = subject;
    }

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    const files = await File.find(filter).populate("subject");
    res.json(files);

  } catch (error) {

    next(error);

  }
};

export const getFileById = async (req, res, next) => {
  try {

    const file = await File.findById(req.params.id).populate("subject");

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
    }

    res.json(file);

  } catch (error) {

    next(error);

  }
};

export const getMyFiles = async (req, res, next) => {
  try {

    const files = await File.find({ uploadedBy: req.user.id })
      .populate("subject")
      .sort({ createdAt: -1 });

    res.json(files);

  } catch (error) {

    next(error);

  }
};

export const searchFiles = async (req, res, next) => {
  try {

    const { q } = req.query;

    const files = await File.find({
      title: { $regex: q, $options: "i" }
    }).populate("subject");

    res.json(files);

  } catch (error) {

    next(error);

  }
};

export const updateFileStatus = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { status, reason } = req.body;

    const update = { status };

    if (status === "rejected" && reason) {
      update.reason = reason;
    }

    const file = await File.findByIdAndUpdate(id, update, { new: true });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Estado del archivo actualizado",
      file
    });

  } catch (error) {

      next(error);

  }
};