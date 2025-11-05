// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// // ✅ Cloudinary configuration (if not set globally)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     let folder = "misc";
//     let resourceType = "image"; // default

//     if (file.fieldname === "logo") folder = "ngo-logos";
//     if (file.fieldname === "pdf") {
//       folder = "donation-pdfs";
//       resourceType = "raw"; // ✅ important for PDFs
//     }


//     // Prefer explicit detection by mimetype for reliability
//     if (file.mimetype === "application/pdf") {
//       resourceType = "raw";
//     }


//     // Build a clean public_id without duplicating extension
//     const original = file.originalname || "file";
//     const nameWithoutExt = original.replace(/\.[^/.]+$/, "");
//     const publicId = `${Date.now()}-${nameWithoutExt}`;


//     return {
//       folder,
//       resource_type: resourceType,
//       access_mode: "public",
//       public_id: publicId,
//     };
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// export default upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary configuration (if not set globally)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
   
    return {
      folder : "donation-images",
      resource_type: "image",
      access_mode: "public",
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}` ,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;

