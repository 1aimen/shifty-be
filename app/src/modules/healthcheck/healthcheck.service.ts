import os from "os";

export const getHealthStatus = () => ({
  status: "ok",
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  system: {
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
    uptime: process.uptime(),
    load: os.loadavg(),
    memory: { free: os.freemem(), total: os.totalmem() },
  },
});
