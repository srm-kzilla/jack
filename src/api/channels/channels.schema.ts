import * as yup from "yup";

const userIdSchema = yup
  .string()
  .trim()
  .min(1, "userId cannot be null")
  .required();

export const channelPostRequestSchema = yup
  .object({
    channelName: yup
      .string()
      .trim()
      .min(1, "channelName cannot be null")
      .required(),
    categoryId: yup
      .string()
      .trim()
      .min(1, "categoryId cannot be null")
      .required(),
    userIds: yup
      .array(userIdSchema)
      .min(1, "userIds cannot be empty array")
      .required(),
  })
  .required();

export const channelDeleteRequestSchema = yup
  .object({
    channelName: yup
      .string()
      .trim()
      .min(1, "channelName cannot be null")
      .required(),
  })
  .required();

export type channelRequest = yup.InferType<typeof channelPostRequestSchema>;
