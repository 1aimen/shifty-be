import { logger } from "./logger.utils";
import { format } from "winston";

export const moduleLogger = (moduleName: string) =>
  logger.child({
    defaultMeta: { label: moduleName },
    format: format.combine(format.label({ label: moduleName })),
  });
