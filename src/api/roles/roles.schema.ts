import * as yup from "yup";

const roleSchema = yup
  .object({
    roleId: yup.string().trim().min(1, "roleId cannot be null").required(),
    eventSlug: yup
      .string()
      .trim()
      .min(1, "eventSlug cannot be null")
      .required(),
  })
  .required();

export const rolesRequestSchema = yup
  .object({
    userId: yup.string().trim().min(1, "userId cannot be null").required(),
    roles: yup
      .array(roleSchema)
      .min(1, "roles cannot be empty array")
      .required(),
  })
  .required();

export type roleRequest = yup.InferType<typeof rolesRequestSchema>;

export interface webhooksDBSchema {
  token: string;
  issuedTo: string;
}

export interface welcomeMessageDBSchema {
  eventSlug: string;
  message: {
    title: string;
    description: string;
    logoUrl: string;
    color: string;
    embeds: Array<{
      name: string;
      value: string;
    }>;
  };
}
