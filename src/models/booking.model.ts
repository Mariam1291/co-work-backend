// src/models/booking.model.ts
import { z } from "zod";

export const CreateBookingSchema = z.object({
  roomId: z.string().min(1),
  branchId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  totalPrice: z.number().positive(),
  depositScreenshot: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;