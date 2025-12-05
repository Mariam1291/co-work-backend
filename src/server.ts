// src/server.ts أو src/server.ts
import express from "express";
import cors from "cors";

// استيراد الروتات كلها مرة واحدة فقط
import authRoutes from "./routes/auth";
import roofRoutes from "./routes/roof";
import eventRoutes from "./routes/event";
import bookingRoutes from "./routes/booking";     // خلي اسم واحد بس
import roomRoutes from "./routes/rooms";
import adminRoutes from "./routes/admin";   
        // اسم واحد بس

const app = express();
const PORT = process.env.PORT || 8080;

// أهم حاجة: الـ Middlewares لازم تكون في الأول خالص
app.use(cors());
app.use(express.json());                    // للـ JSON
app.use(express.urlencoded({ extended: true })); // للـ form-data

// كل الروتات بعد الـ middleware
app.use("/auth", authRoutes);
app.use("/roof", roofRoutes);
app.use("/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/admin", adminRoutes);             // الـ admin route

// سطر واحد بس لتشغيل السيرفر
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});