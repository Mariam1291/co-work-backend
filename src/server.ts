// src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import BackendlessClient from "backendless";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// إعداد الوثائق باستخدام swagger-jsdoc

// src/server.ts - في أول الملف
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/booking";
import branchesRoutes from "./routes/branches";
import eventRoutes from "./routes/event";
import notificationRoutes from "./routes/notifications";
import paymentRoutes from "./routes/payment";
import roofRoutes from "./routes/roof";
import roomsRoutes from "./routes/rooms";
import userRoutes from "./routes/users";
import gamesRoutes from "./routes/games";

const app = express();
const PORT = process.env.PORT || 8080;

const options = {
  swaggerDefinition: {
    openapi: "3.0.0", // النسخة الخاصة بـ OpenAPI
    info: {
      title: "Co-Work Backend API", // اسم الـ API
      version: "1.0.0", // النسخة
      description: "API documentation for the Co-Work Backend system", // وصف الـ API
    },
    servers: [
      {
        url: "https://co-work-backend-test.up.railway.app", // النطاق على Railway
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // المسارات التي تحتوي على الـ API
};

const swaggerSpec = swaggerJSDoc(options);

// إعداد واجهة Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// تشغيل السيرفر
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
  console.log('Swagger docs are available at https://co-work-backend-test.up.railway.app/api-docs');
});

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
app.use("/api/rooms", roomsRoutes);
app.use("/admin", adminRoutes);
app.use("/branches", branchesRoutes);
app.use("/notification", notificationRoutes);
app.use("/userRoutes", userRoutes);
app.use("/api/games", gamesRoutes);

// === Server Listen (فقط لما تشغل npm run dev) ===
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// === Export للتيستات ===
export default app;
