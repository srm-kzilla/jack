import { NextFunction, Request, Response, Router } from "express";
import validateQuery from "../middlewares/validate-query";
import { validateWebhook } from "../middlewares/validate-webhook";
import {
  channelPostRequestSchema,
  channelDeleteRequestSchema,
  channelPostRequest,
  channelDeleteRequest,
  channelJoinRequestSchema,
  channelJoinRequest,
} from "./channels.schema";
import { addChannel, deleteChannel, joinChannel } from "./channels.service";

const router = Router();

const handlePostChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userIds, categoryId, channelName } = req.body as channelPostRequest;
    const channelIds = await addChannel({ channelName, categoryId, userIds });
    res.status(201).json({
      success: true,
      message: `New Channels Created!`,
      createdIds: channelIds,
    });
  } catch (err) {
    next(err);
  }
};

const handleDeleteChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { channelIds } = req.body as channelDeleteRequest;
    const deletedChannelIds = await deleteChannel(channelIds);
    res.status(201).json({
      success: true,
      message: `Requested Channels Deleted!`,
      deletedIds: deletedChannelIds,
    });
  } catch (err) {
    next(err);
  }
};

const handleJoinChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userIds, channelId } = req.body as channelJoinRequest;
    const addedUserIds = await joinChannel({ userIds, channelId });
    res.status(201).json({
      success: true,
      message: `Requested Users Added to Channel`,
      channelId,
      addedUserIds,
    });
  } catch (err) {
    next(err);
  }
};

router.post(
  "/channel",
  validateWebhook(),
  validateQuery("body", channelPostRequestSchema),
  handlePostChannel
);

router.delete(
  "/channel",
  validateWebhook(),
  validateQuery("body", channelDeleteRequestSchema),
  handleDeleteChannel
);
router.post(
  "/channel/join",
  validateWebhook(),
  validateQuery("body", channelJoinRequestSchema),
  handleJoinChannel
);

export default router;
