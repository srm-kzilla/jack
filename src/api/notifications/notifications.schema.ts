import * as yup from "yup";
import { emailSchema } from "../../models/email";

export const notificationsRequestSchema = yup.object({
  emails: yup.array().of(emailSchema).required(),
  title: yup.string().required(),
  body: yup.string().required(),
});

export type notificationsRequest = yup.InferType<
  typeof notificationsRequestSchema
>;

export interface notificationUserSchema {
  email: string;
  discordID: string;
}

export interface getDiscordUserDetailSchema {
  userIDArray: Array<notificationUserSchema>;
  failedEmails: Array<string>;
  successEmails: Array<string>;
}
