import * as yup from "yup";
import { emailSchema } from "../../models/email";

export const notificationsRequestSchema = yup.object({
  emails: yup.array().of(emailSchema).required(),
  slug: yup.string().required(),
  title: yup.string().required(),
  body: yup.string().required(),
});

export type notificationsRequest = yup.InferType<typeof notificationsRequestSchema>;