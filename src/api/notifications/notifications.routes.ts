import { NextFunction, Request, Response, Router } from "express";
import validateQuery from "../middlewares/validate-query";
import { validateWebhook } from "../middlewares/validate-webhook";
import { notificationsService } from "./notifications.service";
import {
  notificationsRequestSchema,
  notificationsRequest,
} from "./notifications.schema";
const router = Router();

const handleNotifications = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO: call function from services
    notificationsService(req.body as notificationsRequest, res as Response);
    res.status(200).json({
      success: true,
      message: "Notifications Sent",
    });
  } catch (err) {
    next(err);
  }
};

router.post(
  "/notifications",
  validateWebhook(),
  validateQuery("body", notificationsRequestSchema),
  handleNotifications
);

export default router;
