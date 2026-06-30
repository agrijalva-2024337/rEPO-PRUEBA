import { body } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateCreateSubject = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la materia es requerido")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder 100 caracteres"),

  checkValidators,
];
