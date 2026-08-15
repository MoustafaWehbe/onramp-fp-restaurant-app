import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
    parts: 20,
  },

  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      const error = new Error("Only images are allowed") as Error & {
        status?: number;
      };

      error.status = 400;

      return cb(error);
    }

    cb(null, true);
  },
});
