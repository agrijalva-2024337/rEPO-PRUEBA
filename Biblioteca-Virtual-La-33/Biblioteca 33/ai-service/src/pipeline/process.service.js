import axios from "axios";
import fs from "fs";
import path from "path";
import {
  extractTextFromPDF,
  extractTextFromImage,
  extractTextFromImageBuffer,
  extractTextFromScannedPDF
} from "../ocr/ocr.service.js";
import { analyzeText } from "../ai/ai.service.js";

const MODERATION_URL =
  process.env.MODERATION_URL ||
  "http://localhost:3000/Biblioteca/v1/moderations";

const FILES_SERVICE_URL =
  process.env.FILES_SERVICE_URL || "http://localhost:3003";

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL ||
  "http://localhost:3005/Biblioteca/v1/notifications/internal/file-status";

const INTERNAL_SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY;


// Actualiza el estado del archivo en files-service (no bloqueante)
const updateFileStatus = async (fileId, status, reason) => {
  try {
    await axios.patch(
      `${FILES_SERVICE_URL}/files/${fileId}/status`,
      { status, ...(reason ? { reason } : {}) },
      {
        headers: { "x-internal-key": INTERNAL_SERVICE_KEY },
        timeout: 15000
      }
    );
  } catch (err) {
    console.error(
      `Error actualizando estado del archivo ${fileId} en files-service:`,
      err.message
    );
  }
};

// Notifica al estudiante el resultado (no bloqueante)
const notifyStudent = async ({ userId, fileId, status, reason }) => {
  try {
    // TODO: este endpoint se implementa en notification-service en el prompt 4
    await axios.post(
      NOTIFICATION_SERVICE_URL,
      { userId, fileId, status, ...(reason ? { reason } : {}) },
      {
        headers: { "x-internal-key": INTERNAL_SERVICE_KEY },
        timeout: 15000
      }
    );
  } catch (err) {
    console.error(
      `Error notificando al estudiante (fileId ${fileId}) en notification-service:`,
      err.message
    );
  }
};


// Determina si el archivo es una imagen
const isImage = (contentType, fileURL) => {
  if (contentType.includes("image")) return true;
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileURL || "");
};


// Determina si el archivo es PDF
const isPDF = (contentType, buffer) => {
  if (contentType.includes("pdf")) return true;

  return buffer.length > 4 && buffer[0] === 0x25 && buffer[1] === 0x50;
};


// Parser seguro de la respuesta de IA
const parseAIResult = (content) => {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return {
      classification: parsed?.classification || "incierto",
      reason: parsed?.reason || "La IA no proporcionó explicación."
    };
  } catch {
    return {
      classification: "incierto",
      reason: "No se pudo interpretar la respuesta de la IA."
    };
  }
};

// Determina si se debe enviar a moderación
const needsModeration = (classification) => {
  return classification === "incierto";
};

export const processFileFromURL = async ({ fileId, uploadedBy, fileURL, title, originalName }) => {
  if (!fileURL) {
    const err = new Error("fileURL es requerido.");
    err.statusCode = 400;
    throw err;
  }

  const response = await axios.get(fileURL, {
    responseType: "arraybuffer",
    timeout: 20000,
    validateStatus: () => true
  });

  if (response.status !== 200) {
    const err = new Error(`Error al descargar archivo (${response.status})`);
    err.statusCode = 400;
    throw err;
  }

  const buffer = Buffer.from(response.data);
  const contentType = (response.headers["content-type"] || "").toLowerCase();

  let text = "";

  try {

    if (isPDF(contentType, buffer)) {

      // intentar extraer texto normal
      text = await extractTextFromPDF(buffer);

      // si no hay texto suficiente - OCR de imágenes
      if (!text || text.trim().length < 20) {
        console.log("PDF escaneado detectado → aplicando OCR de imágenes");
        text = await extractTextFromScannedPDF(buffer);
      }

    } else if (isImage(contentType, fileURL)) {

      text = await extractTextFromImageBuffer(buffer);

    } else {

      text = await extractTextFromPDF(buffer);

    }

  } catch (err) {
    console.error("Error en OCR:", err.message);
    text = "";
  }

  // Validar texto OCR
  if (!text || text.trim().length < 20) {
    text = "Contenido insuficiente para análisis.";
  }

  const aiInput = text.slice(0, 4000);

  const rawAI = await analyzeText(aiInput);
  const aiResult = parseAIResult(rawAI);
  console.log("===== RESULTADO IA =====");
  console.log("Clasificación:", aiResult.classification);
  console.log("Razón:", aiResult.reason);
  console.log("========================");

  let moderation = null;

  if (aiResult.classification === "material_apoyo") {

    // La IA está segura de que es material de apoyo → aprobar directamente
    await updateFileStatus(fileId, "approved");
    await notifyStudent({
      userId: uploadedBy,
      fileId,
      status: "approved"
    });

  } else if (aiResult.classification === "tarea_resuelta") {

    // La IA está segura de que es una tarea resuelta → rechazar directamente
    await updateFileStatus(fileId, "rejected", aiResult.reason);
    await notifyStudent({
      userId: uploadedBy,
      fileId,
      status: "rejected",
      reason: aiResult.reason
    });

  } else if (needsModeration(aiResult.classification)) {

    // "incierto" → crear moderación pendiente para revisión humana.
    // NO se toca el status del file: sigue en "pending" hasta que un humano decida.
    try {

      const payload = {
        fileId,
        uploadedBy: uploadedBy || "anonymous",
        fileURL,
        title,
        originalName,
        aiClassification: aiResult.classification,
        aiReason: aiResult.reason
      };

      const modRes = await axios.post(MODERATION_URL, payload, {
        headers: { "x-internal-key": INTERNAL_SERVICE_KEY },
        timeout: 15000,
        validateStatus: () => true
      });

      if (modRes.status >= 200 && modRes.status < 300) {
        moderation = modRes.data;
      }

    } catch (err) {
      console.error("Error enviando a Moderation Service:", err.message);
    }
  }

  return {
    ai: aiResult,
    moderation
  };
};

// Procesamiento de archivo local- pruebas
export const processLocalFile = async ({ filePath, uploadedBy }) => {

  const ext = path.extname(filePath).toLowerCase();

  let text = "";

  try {

    if (ext === ".pdf") {

      const buffer = fs.readFileSync(filePath);

      text = await extractTextFromPDF(buffer);

      if (!text || text.trim().length < 20) {
        console.log("PDF escaneado detectado → OCR");
        text = await extractTextFromScannedPDF(buffer);
      }

    } else {

      text = await extractTextFromImage(filePath);

    }

  } catch (err) {
    console.error("Error en OCR local:", err.message);
  }

  if (!text || text.trim().length < 20) {
    text = "Contenido insuficiente para análisis.";
  }

  const aiInput = text.slice(0, 4000);

  const rawAI = await analyzeText(aiInput);
  const aiResult = parseAIResult(rawAI);
  console.log("===== RESULTADO IA =====");
  console.log("Clasificación:", aiResult.classification);
  console.log("Razón:", aiResult.reason);
  console.log("========================");

  return {
    ai: aiResult,
    moderation: null
  };
};