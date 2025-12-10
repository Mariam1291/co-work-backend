import { Request, Response } from "express";
import Backendless from "backendless";

// إعداد الاتصال بـ Backendless
const PaymentProofs = Backendless.Data.of("payment_proofs");

// دالة لرفع إثبات الدفع
export const uploadPaymentProof = async (req: Request, res: Response) => {
  const { user_id, booking_ids, method, payer_phone, amount, screenshot_url } = req.body || {};

  // التحقق من وجود البيانات المطلوبة
  if (!user_id || !Array.isArray(booking_ids) || booking_ids.length === 0 ||
      !method || !payer_phone || !amount || !screenshot_url) {
    return res.status(400).json({
      message: "user_id, booking_ids, method, payer_phone, amount, screenshot_url are required"
    });
  }

  try {
    const proof = {
      objectId: "123",  // Example objectId
      user_id,
      booking_ids,
      method,
      payer_phone,
      amount,
      screenshot_url,
      status: "pending",
      created_at: new Date().toISOString(),
      reviewed_by: null,
      reviewed_at: null
    };

    // حفظ إثبات الدفع في Backendless
    await PaymentProofs.save(proof);

    res.status(200).json({
      success: true,
      proof_id: proof.objectId,
      status: "pending"
    });
  } catch (err) {
    console.error("uploadPaymentProof error:", err);
    res.status(500).json({ message: "خطأ في السيرفر الداخلي" });
  }
};
