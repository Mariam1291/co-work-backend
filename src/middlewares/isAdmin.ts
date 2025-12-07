import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './verifyAuth'; // التأكد من المسار الصحيح

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "ممنوع: صلاحيات الأدمن فقط" });
  }
  next();  // إذا كان المستخدم أدمن، نستمر في الـ route
};
