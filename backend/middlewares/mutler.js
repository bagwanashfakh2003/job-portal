import multer from "multer";

const storage = multer.memoryStorage();

// ✅ for company (single file)
export const singleUpload = multer({ storage }).single("file");

// ✅ for profile (multiple files)
export const multiUpload = multer({ storage }).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);