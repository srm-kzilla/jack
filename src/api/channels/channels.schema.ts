import * as yup from "yup";

const userIdSchema = yup
  .string()
  .trim()
  .min(1, "userId cannot be null")
  .required();

const channelIdSchema = yup
  .string()
  .trim()
  .min(1, "channelID cannot be null")
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
    channelIds: yup
      .array(channelIdSchema)
      .min(1, "channelIds cannot be empty array")
      .required(),
  })
  .required();

export const channelJoinRequestSchema = yup
  .object({
    channelId: yup
      .string()
      .trim()
      .min(1, "channelId cannot be null")
      .required(),
    userIds: yup
      .array(userIdSchema)
      .min(1, "userIds cannot be empty array")
      .required(),
  })
  .required();

export type channelPostRequest = yup.InferType<typeof channelPostRequestSchema>;
export type channelDeleteRequest = yup.InferType<
  typeof channelDeleteRequestSchema
>;
export type channelJoinRequest = yup.InferType<typeof channelJoinRequestSchema>;

export interface channelDBSchema {
  channelName: string;
  categoryId: string;
  userIds: Array<string>;
  channelId: {
    text: string;
    voice: string;
  };
}
