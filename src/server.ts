import express from "express";
import router from "./routes/index";
import { config } from "./config/index";
import { errorHandler } from "./middlewares/errors.middleware";
import { logger } from "./utils/logger.utils";

const app = express();
app.use(express.json());
app.use("/", router);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
});
