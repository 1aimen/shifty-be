import express from "express";
import router from "./routes/index";
import { config } from "./config/index";
import { errorHandler } from "./middlewares/errors.middleware";
import { logger } from "./utils/logger.utils";
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const API_VERSION = config.api_version;

const app = express();
app.use(express.json());
app.use("/", router);
app.use(errorHandler);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Shifty API",
      version: "1.0.0",
      description: "Shift and employee clock in API",
      contact: {
        name: "Your Name",
        email: "info@email.com",
      },
    },

    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
  },
  apis: ["./src/modules/**/*.controller.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: express.Application) => {
  app.use(`/${API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(specs));
};
setupSwagger(app);

app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
  logger.info(
    `Swagger docs at http://localhost:${config.port}/${config.api_version}/docs`
  );
});
