import express from "express";
import {
  validateJWT,
  requireRole
} from "../../../shared/middlewares/jwt.middleware.js";
import { validateCreateSubject } from "../middlewares/subject-validator.js";
import {
  createSubject,
  getSubjects
} from "../controllers/subject-controller.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Subjects
 */

/**
 * @openapi
 * /subjects:
 *   post:
 *     tags: [Subjects]
 *     summary: Crear materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Materia creada
 */
router.post(
  "/",
  validateJWT,
  requireRole("ADMIN_ROLE", "TEACHER_ROLE"),
  validateCreateSubject,
  createSubject
);

/**
 * @openapi
 * /subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Obtener materias
 */
router.get("/", validateJWT, getSubjects);

export default router;