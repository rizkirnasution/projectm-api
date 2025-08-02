import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";

//menggunakan memoryStorage agar file tidak disimpan di disk, tp di memory (buffer)
const storage = multer.memoryStorage();

//File filter: hanya izinkan file PDF berdasarkan mimetype
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  //hanya format .pdf 
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    //tolak selain .pdf
    cb(new Error("Only PDF files are allowed"));
  }
};

//konfigurasi multer dengan storage dan filter
const upload = multer({ storage, fileFilter });

// Tambahan: Middleware error handler untuk multer
export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err instanceof multer.MulterError ||
    err.message === "Only PDF files are allowed"
  ) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  next(err); // untuk error lainnya
};

export default upload;
