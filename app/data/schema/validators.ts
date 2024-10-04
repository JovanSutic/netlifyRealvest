import { z } from "zod";

const password = z
  .string()
  .min(8, { message: "passwordLength" })
  .regex(/[a-z]/, {
    message: "passwordLowercase",
  })
  .regex(/[A-Z]/, {
    message: "passwordUppercase",
  })
  .regex(/[#?!@$%^&*-]/, {
    message: "passwordSpecial",
  })
  .regex(/[0-9]/, { message: "passwordDigit" });

export const passwordSchema = z.object({
  email: z.string().email({ message: "emailError" }),
  type: z.string().max(1),
  password: password,
});

export const magicSchema = z.object({
  email: z.string().email({ message: "emailError" }),
  type: z.string().max(1),
});

export const registrationSchema = z.object({
  name: z.string().min(3, { message: "registrationApiError" }).trim(),
  email: z.string().email({ message: "emailError" }),
  password: password,
});

export const connectionSchema = z.object({
  archiveId: z.string().regex(/^\d+$/),
  detailId: z.string().regex(/^\d+$/),
});

export const forgetSchema = z.object({
  email: z.string().email({ message: "emailError" }),
});

export const changePassSchema = z
  .object({
    password: password,
    confirmPass: password,
  })
  .superRefine(({ confirmPass, password }, ctx) => {
    if (confirmPass !== password) {
      ctx.addIssue({
        code: "custom",
        message: "confirmError",
        path: ["confirmPass"],
      });
    }
  });

export const blogSchema = z.object({
  name: z.string().min(1, "nameErrorMin").max(50, "nameErrorMax"),
  language: z.string().min(1, "languageErrorMin").length(2, "languageErrorMax"),
  description: z
    .string()
    .min(1, "descriptionErrorMin")
    .max(180, "descriptionErrorMax"),
  link: z.string().min(1, "linkErrorMin").max(120, "linkErrorMax"),
});
