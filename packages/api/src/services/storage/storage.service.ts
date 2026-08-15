import { storageConfig } from "src/config/storage";
import { supabase } from "src/config/supabase";

export interface UploadableFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const storageService = {
  uploadFile: async (
    file: UploadableFile,
    folder: string
  ) => {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;

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

  uploadFiles: async (
    files: UploadableFile[],
    folder: string
  ) => {
    return Promise.all(
      files.map(file =>
        storageService.uploadFile(file, folder)
      )
    );
  },
};