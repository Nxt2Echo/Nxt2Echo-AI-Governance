import { storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  static async uploadFile(fileBuffer: Buffer, mimetype: string, folder: string): Promise<string> {
    try {
      const bucket = storage.bucket();
      const extension = mimetype.split('/')[1] || 'bin';
      const filename = `${folder}/${uuidv4()}.${extension}`;
      const file = bucket.file(filename);

      await file.save(fileBuffer, {
        metadata: { contentType: mimetype },
      });

      // Try to make public, but don't crash if uniform ACLs prevent it
      try {
        await file.makePublic();
      } catch (aclError: any) {
        console.warn('Could not make file public (ACLs may be disabled):', aclError.message);
      }

      return `https://storage.googleapis.com/${bucket.name}/${filename}`;
    } catch (error: any) {
      console.error('Firebase Storage upload error:', error.message);
      // Return a dummy placeholder if storage is not set up
      return folder === 'images' 
        ? 'https://via.placeholder.com/400?text=Image+Upload+Failed' 
        : '';
    }
  }

  static async uploadImage(fileBuffer: Buffer, mimetype: string): Promise<string> {
    return this.uploadFile(fileBuffer, mimetype, 'images');
  }

  static async uploadVoice(fileBuffer: Buffer, mimetype: string): Promise<string> {
    return this.uploadFile(fileBuffer, mimetype, 'voices');
  }
}
