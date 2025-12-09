// src/routes/payment.ts
import { Router } from "express";
import Backendless from "backendless";

const router = Router();
const PaymentProofs = Backendless.Data.of("payment_proofs");

router.post("/upload-proof", async (req, res) => {
  const { user_id, booking_ids, method, payer_phone, amount, screenshot_url } = req.body || {};

  if (!user_id || !Array.isArray(booking_ids) || booking_ids.length === 0 ||
      !method || !payer_phone || !amount || !screenshot_url) {
    return res.status(400).json({
      message: "user_id, booking_ids, method, payer_phone, amount, screenshot_url are required"
    });
  }

  try {
    const proof = {
      objectId: "123",  // مثال لتحديد الـ objectId
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
});

export default router; // تأكد من تصديره هكذا
