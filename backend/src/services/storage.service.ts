import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

export class StorageService {
  /**
   * Uploads a raw buffer to Cloudinary using upload streams
   */
  public static async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: filename.replace(/\.[^/.]+$/, ''), // strip extension
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload failed:', error);
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          if (!result) {
            return reject(new Error('Upload result is undefined'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );
      stream.end(buffer);
    });
  }

  /**
   * Deletes an uploaded asset from Cloudinary
   */
  public static async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Deleted Cloudinary asset: ${publicId}`);
    } catch (err) {
      logger.error(`Cloudinary deletion failed for publicId: ${publicId}`, err);
    }
  }
}
export default StorageService;
