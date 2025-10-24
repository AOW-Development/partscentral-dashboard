import { useState, useRef, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { S3UploadService } from './S3UploadService';

interface UploadSectionProps {
  title: string;
  onFilesUploaded?: (fileUrls: string[]) => void;
  onFileUploaded?: (fileUrl: string) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  buttonLabel?: string;
  buttonClass?: string;
  preview?: boolean;
  fileLimit?: number;
  showPreview?: boolean;
  folder?: string;
  showToast?: boolean;
}

const UploadSection = ({
  title,
  onFilesUploaded,
  onFileUploaded,
  multiple = false,
  accept = 'image/*',
  label = 'Upload Photos',
  buttonLabel = 'Upload',
  buttonClass = 'bg-blue-700 hover:bg-blue-600',
  preview = false,
  fileLimit = 1,
  showPreview = false,
  folder = 'uploads',
  showToast = true,
}: UploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const s3Service = new S3UploadService();
  const [fileS3Keys, setFileS3Keys] = useState<String[]>([]);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      
      if (multiple && files.length > fileLimit) {
        throw new Error(`Maximum ${fileLimit} files allowed`);
      }
      
      if (multiple && files.length > 1) {
        const urls = await s3Service.uploadMultipleFiles(Array.from(files), folder);
        setUploadedFileUrls(urls);
        onFilesUploaded?.(urls);
        
        
        if (showPreview && preview) {
          const previews = Array.from(files).map(file => {
            return URL.createObjectURL(file);
          });
          setFilePreviews(previews);
        }

        if(showToast){
          console.log(`${urls.length} files uploaded successfully.`);
        }
      } else {
        
        const file = files[0];
        const key = await s3Service.uploadFile(file, folder);
        setFileS3Keys([key]);
        setUploadedFileUrls([key]);
        onFileUploaded?.(key);
        
        
        if (showPreview && preview) {
          const previewUrl = URL.createObjectURL(file);
          setFilePreviews([previewUrl]);
        }

        if(showToast){
          console.log(`File uploaded successfully: ${key}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Create a safe ID for the input element
  const getSafeId = () => {
    return `upload-${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="bg-[#0a1929] p-6 rounded-lg shadow-lg mb-6">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          id={getSafeId()}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        
        <label
          htmlFor={getSafeId()}
          className={`flex items-center gap-2 cursor-pointer ${buttonClass} text-white px-4 py-2 rounded-lg`}
        >
          <Upload size={16} />
          {buttonLabel}
        </label>
        
        {isUploading && (
          <span className="text-blue-400">Uploading...</span>
        )}
        
        {uploadError && (
          <span className="text-red-500 text-sm">{uploadError}</span>
        )}
      </div>
        // Display uploaded file URLs with copy button for single file upload
        {uploadedFileUrls.length > 0 && !showPreview && (
        <div className="mt-4">
          {uploadedFileUrls.map((fileUrl, index) => (
            <div key={index} className="text-sm text-green-400">
            <span className="text-white text-sm truncate max-w-xs">{fileUrl}</span>
              <button 
              onClick={() => s3Service.copyToClipboard(fileUrl)}
                className="ml-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
              Copy
              </button>
            </div>
          ))}
          </div>
      )}

  
      {showPreview && filePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {filePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Preview ${index}`} 
                className="w-full h-24 object-cover rounded-md"
              />
              <button 
                onClick={() => {
                  setFilePreviews(prev => prev.filter((_, i) => i !== index));
                  setUploadedFileUrls(prev => prev.filter((_, i) => i !== index));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
