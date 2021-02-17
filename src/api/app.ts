import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import { config } from "dotenv";
import { serverLogger } from "../utils/logger";
import rolesRoutes from "./roles/roles.routes";
import { errorHandler } from "./error/error.handler";
import { initDbClient } from "../utils/database";
import { initDiscordBot } from "../utils/discord";

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
app.use("/api/v1", rolesRoutes);
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
