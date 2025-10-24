
export class S3UploadService {
  private readonly API_URL: string;

  constructor() {
    this.API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

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

  
  async uploadMultipleFiles(files: File[], folder?: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

    // Copy url to clipboard
    copyToClipboard(text: string): void {
      navigator.clipboard.writeText(text).then(() => {
        console.log('URL copied to clipboard');
      }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}