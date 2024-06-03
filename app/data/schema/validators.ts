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
