import { Request, Response } from "express";
import { db } from "../config/firebase";

// دالة لإضافة أو تحديث بيانات المستخدم في Firestore
export const createUser = async (req: Request, res: Response) => {
  const { email, user_id, image, nameAr, nameEn, phone, user_type } = req.body;

  // التحقق من وجود الحقول الأساسية (الإيميل و الـ user_id)
  if (!email || !user_id) {
    return res.status(400).json({ message: "الإيميل و user_id هما الحقول الأساسية" });
  }

  try {
    // إعداد البيانات لحفظها في Firestore
    const userRef = db.collection("users").doc(user_id);

    // حفظ أو تحديث بيانات المستخدم في Firestore
    await userRef.set({
      email,
      image: image || "",  // إذا كانت الصورة غير موجودة، يتم تعيين قيمة فارغة
      nameAr: nameAr || "", // إذا كان الاسم بالعربي غير موجود يتم تعيين قيمة فارغة
      nameEn: nameEn || "", // إذا كان الاسم بالإنجليزي غير موجود يتم تعيين قيمة فارغة
      phone: phone || "",  // إذا كانت رقم الهاتف غير موجود يتم تعيين قيمة فارغة
      user_type: user_type || "regular",  // تعيين نوع المستخدم افتراضياً إلى "regular" إذا لم يكن موجودًا
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });  // merge يسمح بتحديث البيانات دون مسحها

    return res.status(200).json({ message: "تم إضافة المستخدم بنجاح", user_id });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء إضافة المستخدم" });
  }
};
