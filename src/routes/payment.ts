import { Router } from "express";
import Backendless from "backendless";

const router = Router();
const PaymentProofs = Backendless.Data.of("payment_proofs");

/**
 * @swagger
 * /payment/upload-proof:
 *   post:
 *     summary: Upload a payment proof
 *     description: Allows a user to upload payment proof for a booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user uploading the proof
 *               booking_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of booking IDs associated with the payment
 *               method:
 *                 type: string
 *                 description: The payment method used (e.g., Vodafone Cash, InstaPay)
 *               payer_phone:
 *                 type: string
 *                 description: The phone number of the payer
 *               amount:
 *                 type: number
 *                 description: The amount paid
 *               screenshot_url:
 *                 type: string
 *                 description: URL of the payment proof screenshot
 *     responses:
 *       200:
 *         description: Payment proof uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 proof_id:
 *                   type: string
 *                   example: "123"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user_id, booking_ids, method, payer_phone, amount, screenshot_url are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "خطأ في السيرفر الداخلي"
 */
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

export default router;
