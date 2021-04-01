import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import { config } from "dotenv";
import { serverLogger } from "../utils/logger";
import rolesRoutes from "./roles/roles.routes";
import channelRoutes from "./channels/channels.routes";
import { errorHandler } from "./error/error.handler";
import { initDbClient } from "../utils/database";
import { initDiscordBot } from "../utils/discord";
import { ERRORS } from "./error/error.constant";
import { join } from "path";

/**
 * Initialize Webhook API Server
 */

config();

const app: Express = express();

/**
 * Mount middlewares
 */
app.use(express.json());
app.use(cors());

/**
 * Mount Routes
 */
app.use(express.static(join(__dirname, "..", "..", "..", "public")));
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.sendFile(join(__dirname, "..", "..", "..", "public", "index.html"));
  } catch (err) {
    next(ERRORS.SERVICE_UNAVAILABLE);
  }
});
app.use("/api/v1", rolesRoutes);
app.use("/api/v1", channelRoutes);
app.use("/healthcheck", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    });
  } catch (err) {
    next(ERRORS.SERVICE_UNAVAILABLE);
  }
});
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
  });
  serverLogger("webhook-error", 404, `Cannot ${req.method} ${req.url}`);
});
app.use(errorHandler);

/**
 * Start Webhook API Server
 */
Promise.all([initDbClient(), initDiscordBot()])
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✔️   Webhook API Listening on Port ${process.env.PORT}`);
    });
  })
  .catch((_) => {
    console.dir(_);
    process.exit(1);
  });

/**
 * For better development experience
 */
process.on("SIGINT", () => {
  process.exit(0);
});
process.on("SIGTERM", () => {
  process.exit(0);
});
