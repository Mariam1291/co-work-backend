import { Request, Response } from "express";
import { db } from "../config/firebase";  // تأكد من أن db مستورد بشكل صحيح
import { firebaseAdmin as admin } from "../config/firebase";  // تأكد من أنك تستورد admin بشكل صحيح

export const createUser = async (req: Request, res: Response) => {
  const { email, user_id, image, nameAr, nameEn, phone, user_type } = req.body;

  // تحقق من وجود الحقول الأساسية
  if (!email || !user_id) {
    return res.status(400).json({ message: "الإيميل و user_id هما الحقول الأساسية" });
  }

  try {
    const userRef = db.collection("users").doc(user_id);

    // حفظ أو تحديث بيانات المستخدم
    await userRef.set({
      email,
      image: image || null,  // تعيين صورة فارغة أو null
      nameAr: nameAr || null,  // تعيين الاسم العربي أو null
      nameEn: nameEn || null,  // تعيين الاسم الإنجليزي أو null
      phone: phone || null,  // تعيين رقم الهاتف أو null
      user_type: user_type || "regular",  // تعيين نوع المستخدم إلى "regular" إذا لم يكن موجودًا
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.status(200).json({ message: "تم إضافة المستخدم بنجاح", user_id });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء إضافة المستخدم" });
  }
};
