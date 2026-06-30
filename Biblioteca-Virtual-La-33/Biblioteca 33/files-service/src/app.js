import "dotenv/config";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./configs/swagger.js";
import connectDB from "./configs/db.js";
import { corsOptions } from "./configs/cors.configuration.js";
import { errorHandler } from "../../shared/utils/responseFormatter.js";

import fileRoutes from "./routes/file-routes.js";
import commentRoutes from "./routes/comment-routes.js";
import subjectRoutes from "./routes/subject-routes.js";

const app = express();

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/files", fileRoutes);
app.use("/comments", commentRoutes);
app.use("/subjects", subjectRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Files Service running on port ${PORT}`);
});
