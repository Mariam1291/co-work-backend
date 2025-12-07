// src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import BackendlessClient from "backendless";

// استيراد الـ routes بطريقة نظيفة (بدل require)
// src/server.ts - في أول الملف
const adminRoutes = require("./routes/admin").default ?? require("./routes/admin");
const authRoutes = require("./routes/auth").default ?? require("./routes/auth");
const bookingRoutes = require("./routes/booking").default ?? require("./routes/booking");
const branchesRoutes = require("./routes/branches").default ?? require("./routes/branches");
const eventRoutes   = require("./routes/event").default ?? require("./routes/event");
const notificationRoutes = require("./routes/notifications").default ?? require("./routes/notifications");
const paymentRoutes = require("./routes/payment").default ?? require("./routes/payment");
const roofRoutes = require("./routes/roof").default ?? require("./routes/roof");
const roomRoutes = require("./routes/rooms").default ?? require("./routes/rooms");
const userRoutes = require("./routes/users").default ?? require("./routes/users");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// === Backendless Init (مرة واحدة بس ومش في التيستات) ===
if (process.env.NODE_ENV !== "test") {
  BackendlessClient.initApp(
    "D17B3F2D-1CE5-431E-ADA5-F0D79519F058",
    "1808CC40-EF83-4A5E-91D3-3DDE69CFC7DE"
  );
  console.log("Backendless initialized successfully");
}

// === Routes ===
app.use("/api/payments", paymentRoutes);
app.use("/auth", authRoutes);
app.use("/roof", roofRoutes);
app.use("/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/admin", adminRoutes);
app.use("/branches",branchesRoutes);
app.use("/notification",notificationRoutes);
app.use("/userRoutes",userRoutes);

// === Server Listen (فقط لما تشغل npm run dev) ===
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// === Export للتيستات ===
export default app;