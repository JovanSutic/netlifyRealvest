import { z } from "zod";

const password = z
  .string()
  .min(8, { message: "Password must have at least 8 characters." })
  .regex(/[a-z]/, {
    message: "Password must have at least 1 lowercase letter.",
  })
  .regex(/[A-Z]/, {
    message: "Password must have at least 1 uppercase letter.",
  })
  .regex(/[#?!@$%^&*-]/, {
    message: "Password must have at least 1 special character.",
  })
  .regex(/[0-9]/, { message: "Password must have at least 1 digit." });

export const passwordSchema = z.object({
  email: z.string().email({ message: "Please provide valid email." }),
  type: z.string().max(1),
  password: password,
});

export const magicSchema = z.object({
  email: z.string().email({ message: "Please provide valid email." }),
  type: z.string().max(1),
});

export const registrationSchema = z.object({
  name: z.string().min(3, { message: "Name must have at least 3 characters." }).trim(),
  email: z.string().email({ message: "Please provide valid email." }),
  password: password,
});
