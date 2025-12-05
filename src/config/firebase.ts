// src/config/firebase.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = require("../../shagaf-fe682-firebase-adminsdk-fbsvc-c692dbcac5.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const storage = admin.storage();

export default admin;
export { db, storage };