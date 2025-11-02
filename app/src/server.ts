import express from "express";
import router from "./routes/index";
import { config } from "./config/index";
import { logRequests } from "./middlewares/requestlogger.middleware";
import { logger } from "./utils/logger.utils";
import { errorMiddleware } from "./middlewares/error.middleware";
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const API_VERSION = config.api_version;

const app = express();
app.use(express.json());
app.use(logRequests);
app.use("/", router);
app.use(errorMiddleware);
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Timetract API",
      version: "1.0.0",
      description: "Employee Shift & clock in management API",
      contact: {
        name: "Aimen BENNACER",
        email: "aimenbennacer1@email.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
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
app.use(errorMiddleware);
setupSwagger(app);

const server = app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
  logger.info(
    `Swagger docs at http://localhost:${config.port}/${config.api_version}/docs`
  );
});

process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason: any) => {
  const msg =
    reason instanceof Error
      ? `${reason.message}\n${reason.stack}`
      : String(reason);
  logger.error(`Unhandled Rejection: ${msg}`);
  gracefulShutdown();
});

function gracefulShutdown() {
  logger.warn("Shutting down server gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(1);
  });

  setTimeout(() => {
    logger.error("Force shutdown.");
    process.exit(1);
  }, 5000);
}
