// tests/booking.test.ts
import request from "supertest";
import app from "../src/server";

// Mock للـ verifyAuth عشان يعدي الـ auth بدون توكن حقيقي
jest.mock("../src/middlewares/verifyAuth", () => {
  return jest.fn((req: any, _res: any, next: any) => {
    req.user = { uid: "test-user-123", email: "test@example.com" };
    next();
  });
});

// Mock للـ Firebase عشان ما يحاولش يتصل بالسحابة أبدًا
jest.mock("../src/config/firebase", () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn().mockResolvedValue({ id: "mock-booking-123" }),
      get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
      where: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
      })),
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
        set: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue(null),
      })),
    })),
    batch: jest.fn(() => ({
      delete: jest.fn(),
      commit: jest.fn().mockResolvedValue(null),
    })),
  },
  storage: {
    file: jest.fn(() => ({
      save: jest.fn().mockResolvedValue(null),
      makePublic: jest.fn().mockResolvedValue(null),
    })),
  },
}));

describe("POST /api/bookings/create", () => {
  const newBooking = {
    roomId: "test-room-001",
    branchId: "test-branch-001",
    date: "2025-12-25",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    totalPrice: 500,
    depositScreenshot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAmEBYYG5kZcAAAAASUVORK5CYII=",
  };

  it("should create a new booking successfully", async () => {
    const res = await request(app)
      .post("/api/bookings/create")
      .send(newBooking)
      .expect(201);

    expect(res.body).toHaveProperty("bookingId");
    expect(res.body.message).toBe("تم إنشاء الحجز بنجاح، في انتظار موافقة الأدمن");
  });
});