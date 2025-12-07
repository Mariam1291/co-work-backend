// src/@types/express.d.ts
import { User } from "../models/User"; // لو عندك موديل User، أو ممكن تسيبه أي حاجة

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        // أضف أي حقل تاني بتستخدمه من الـ Firebase Auth
      };
    }
  }
}

// لازم تسيب السطر ده فاضي في الآخر عشان TypeScript يعتبره module
export {};