import { NextFunction, Request, Response, Router } from "express";
import validateQuery from "../middlewares/validate-query";
import { validateWebhook } from "../middlewares/validate-webhook";
import { rolesRequestSchema, roleRequest } from "./roles.schema";
import { addRole, deleteRole } from "./roles.service";

const router = Router();

const handlePostRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, roles } = req.body as roleRequest;
    await addRole(userId, roles);
    res.status(201).json({
      success: true,
      message: "Appropriate roles have been assigned!",
    });
  } catch (err) {
    next(err);
  }
};

const handleDeleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, roles } = req.body as roleRequest;
    await deleteRole(userId, roles);
    res.status(201).json({
      success: true,
      message: "Appropriate roles have been deleted!",
    });
  } catch (err) {
    next(err);
  }
};

router.post(
  "/roles",
  validateWebhook(),
  validateQuery("body", rolesRequestSchema),
  handlePostRole
);

router.delete(
  "/roles",
  validateWebhook(),
  validateQuery("body", rolesRequestSchema),
  handleDeleteRole
);

export default router;
