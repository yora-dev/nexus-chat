import fs from 'fs';
import path from 'path';

/**
 * Utility service to delete local uploaded files when deleted/updated
 */
export const deleteLocalFile = (relativePath) => {
  if (!relativePath) return;
  try {
    const absolutePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (error) {
    console.error(`[FileService Error] Failed to delete file: ${relativePath}`, error);
  }
};