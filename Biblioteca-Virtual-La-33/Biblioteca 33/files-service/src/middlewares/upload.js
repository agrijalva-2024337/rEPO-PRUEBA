import multer from "multer";
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

const { CloudinaryStorage } = multerStorageCloudinary;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "biblioteca-files",
    resource_type: "raw"
  }
});

export default multer({ storage });
