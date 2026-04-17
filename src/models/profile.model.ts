import { z } from 'zod';

export type TChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
}

export type TChangePasswordResponse = {
  value: {
    message: string;
  },
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    description: string;
  };
}

export const ChangePasswordFormSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Current password is required')
    .max(100, 'Password must be less than 100 characters')
    .trim(),
  newPassword: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/(?=.*[A-Z])/, 'Password must include an uppercase letter')
    .regex(/(?=.*\d)/, 'Password must include a number')
    .regex(/(?=.*[^A-Za-z0-9])/, 'Password must include a special character')
    .trim(),
  confirmNewPassword: z.string().min(1, 'Confirm password is required').trim(),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmNewPassword) {
    ctx.addIssue({
      code: 'custom',
      path: ['confirmNewPassword'],
      message: 'Passwords must match'
    });
  }
});

export type ChangePasswordData = z.infer<typeof ChangePasswordFormSchema>;
