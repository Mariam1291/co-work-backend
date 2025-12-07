// src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// إعداد Cloudinary
cloudinary.config({
  cloud_name: "dibzo6bms",  // استبدلها باسم السحابة الخاص بك
  api_key: "175424348567478",  // استبدلها بمفتاح الـ API الخاص بك
  api_secret: "zB0oVotO3zYAaMWAUcvqJ8gUDj4"  // استبدلها بمفتاح السر الخاص بك
});

export default cloudinary;
