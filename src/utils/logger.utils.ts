export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  warning: (msg: string) => console.log(`[WARNING] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};
