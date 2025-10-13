import express from "express";
import router from "./routes/index";
import { config } from "./config/index";
import { errorHandler } from "./middlewares/errors.middleware";
import { logger } from "./utils/logger.utils";
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const API_VERSION = config.api_version;

const app = express();
app.use(express.json());
app.use("/", router);
app.use(errorHandler);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
  },
  apis: ["./routes/index.ts"], // or ./dist/... if compiled
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(`/${API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
});
