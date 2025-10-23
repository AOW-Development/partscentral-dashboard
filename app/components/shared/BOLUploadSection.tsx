import { useState, useRef, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { S3UploadService } from './S3UploadService';

interface BOLUploadSectionProps {
  onFileUploaded?: (fileUrl: string) => void;
  onSend?: () => void;
  label?: string;
  sendLabel?: string;
  sendButtonClass?: string;
  folder?: string;
  accept?: string;
}

const BOLUploadSection = ({
  onFileUploaded,
  onSend,
  label = 'Upload BOL',
  sendLabel = 'Send',
  sendButtonClass = 'bg-blue-600 hover:bg-blue-700',
  folder = 'bol-uploads',
  accept = '.pdf,.jpg,.jpeg,.png',
}: BOLUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const s3Service = new S3UploadService();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      
      const file = files[0];
      const url = await s3Service.uploadFile(file, folder);
      setFileUrl(url);
      onFileUploaded?.(url);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = () => {
    if (onSend) {
      onSend();
    } else if (fileUrl) {
      alert("Sent!"); // Default behavior if no handler provided
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-6 w-full">
      <input
        type="file"
        accept={accept}
        className="hidden"
        id="upload-bol"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      <label
        htmlFor="upload-bol"
        className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600"
      >
        <Upload size={16} />
        {label}
      </label>
      
      {isUploading && (
        <span className="text-blue-400">Uploading...</span>
      )}
      
      {uploadError && (
        <span className="text-red-500 text-sm">{uploadError}</span>
      )}
      
      <button
        onClick={handleSend}
        disabled={!fileUrl || isUploading}
        className={`${sendButtonClass} px-6 py-2 rounded-full text-white font-medium transition-colors ${!fileUrl || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {sendLabel}
      </button>
    </div>
  );
};

export default BOLUploadSection;
