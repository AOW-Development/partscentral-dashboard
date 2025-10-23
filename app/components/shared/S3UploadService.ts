/**
 * S3 Upload Service
 * Handles all S3 file upload operations for the application
 */
export class S3UploadService {
  private readonly API_URL: string;

  constructor() {
    this.API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Upload a file to S3
   * @param file - The file to upload
   * @param folder - Optional folder path in S3
   * @returns Promise with the S3 key
   */
  async uploadFile(file: File, folder?: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add folder parameter if provided
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(`${this.API_URL}/upload-single`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.file.key;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Get a presigned URL for accessing a file in S3
   * @param s3Key - The S3 key of the file
   * @returns Promise with the presigned URL
   */
  async getPresignedUrl(s3Key: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.API_URL}/presigned-url/${encodeURIComponent(s3Key)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to get presigned URL with status ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      // Return the direct URL as fallback
      return s3Key;
    }
  }

  /**
   * Upload multiple files to S3 and return their keys
   * @param files - Array of files to upload
   * @returns Promise with array of S3 keys
   */
  async uploadMultipleFiles(files: File[], folder?: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }
}