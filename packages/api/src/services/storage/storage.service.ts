import { storageConfig } from "src/config/storage";
import { supabase } from "src/config/supabase";

export interface UploadableFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

const sanitizeFilename = (filename: string) => {
  return filename
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 100);
};

export const storageService = {
  uploadFile: async (file: UploadableFile, folder: string) => {
    const safeName = sanitizeFilename(file.originalname);

    const fileName = `${crypto.randomUUID()}-${safeName || "upload"}`;

    const path = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(storageConfig.bucketName)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(storageConfig.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  deleteFile: async (publicUrl: string) => {
    const bucketName = storageConfig.bucketName;

    const decodedUrl = decodeURIComponent(publicUrl);

    const marker = `/object/public/${bucketName}/`;

    const index = decodedUrl.indexOf(marker);

    if (index === -1) {
      throw new Error("Invalid Supabase storage URL");
    }

    const path = decodedUrl.substring(index + marker.length);

    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      throw error;
    }
  },
};