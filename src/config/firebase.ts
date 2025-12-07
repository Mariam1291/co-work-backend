// src/config/firebase.ts
import admin from "firebase-admin";

// لو المتغيرات موجودة في .env (الطريقة المفضلة والأضمن)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: "shagaf-fe682.appspot.com", // غيّرها للـ project id بتاعك + .appspot.com
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();
export const firebaseAdmin = admin;
console.log("🔥 Project ID from env:", process.env.FIREBASE_PROJECT_ID);
console.log("🔥 Client Email from env:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("🔥 Private Key exists:", !!process.env.FIREBASE_PRIVATE_KEY);
export default admin;