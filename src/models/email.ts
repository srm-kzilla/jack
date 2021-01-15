import * as yup from "yup";
export const emailSchema = yup.string().email();

export type Email = yup.InferType<typeof emailSchema>;
