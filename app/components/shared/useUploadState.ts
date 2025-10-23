import { useState, useCallback } from 'react';

interface UseUploadStateOptions {
  multiple?: boolean;
  fileLimit?: number;
}

export const useUploadState = (options: UseUploadStateOptions = {}) => {
  const { multiple = false, fileLimit = 1 } = options;
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const clearUploadState = useCallback(() => {
    setIsUploading(false);
    setUploadError(null);
    setUploadedFiles([]);
    setFilePreviews([]);
  }, []);

  const handleUploadError = useCallback((error: string) => {
    setUploadError(error);
    setIsUploading(false);
  }, []);

  return {
    isUploading,
    uploadError,
    uploadedFiles,
    filePreviews,
    setIsUploading,
    setUploadError,
    setUploadedFiles,
    setFilePreviews,
    clearUploadState,
    handleUploadError
  };
};
