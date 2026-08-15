const bucketName = process.env.STORAGE_BUCKET_NAME;

if (!bucketName) {
  throw new Error("STORAGE_BUCKET_NAME is not defined");
}

export const storageConfig = {
  bucketName,
};