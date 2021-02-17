import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { ERRORS } from "../error/error.constant";
import { getDbClient } from "../../utils/database";
import { webhooksDBSchema } from "../roles/roles.schema";

export const WebhookRequestSchema = yup
  .object({
    authorization: yup
      .string()
      .trim()
      .min(1, "Webhook cannot be null")
      .matches(/^Bearer [A-Za-z0-9]+$/, "Webhook should be Bearer Token"),
  })
  .required();

type WebhookRequest = yup.InferType<typeof WebhookRequestSchema>;

export const validateWebhook = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers as WebhookRequest;
      if (!authorization) {
        return next(ERRORS.WEBHOOK_ERROR);
      }
      const webhookToken = authorization.split(" ")[1];
      const db = (await getDbClient())
        .db()
        .collection<webhooksDBSchema>("webhook-tokens");
      const exists = await db.countDocuments({
        token: webhookToken,
      });
      if (!exists) {
        throw ERRORS.WEBHOOK_DNE;
      }
      next();
    } catch (err) {
      next({
        httpStatus: 403,
        message: `${err.name ? err.name : "WebhookError"}: ${err.message}`,
      });
    }
  };
};
