// // pages/api/upload.js
// import { uploadToS3 } from '../lib/awsS3Connect';
// import {NextApiRequest, NextApiResponse} from 'next';
// import formidable from 'formidable';
// import fs from 'fs/promises';

// // Disable body parser for file upload
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req : NextApiRequest, res : NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     // Parse form data
//     const form = formidable({
//       maxFiles: 10,
//       maxFileSize: 50 * 1024 * 1024, // 50MB
//     });

//     const [fields, files] = await form.parse(req);

//     // Handle single or multiple files
//     const uploadedFiles = files.files || files.file;
    
//     if (!uploadedFiles) {
//       return res.status(400).json({ error: 'No files uploaded' });
//     }

//     // Convert to array if single file
//     const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

//     // Process files
//     const filePromises = fileArray.map(async (file) => {
//       const fileBuffer = await fs.readFile(file.filepath);
      
//       // Determine folder based on file type
//       let folder = 'others';
//       if (file.mimetype && file.mimetype.startsWith('image/')) {
//         folder = 'images';
//       } else if (file.mimetype === 'application/pdf') {
//         folder = 'pdfs';
//       }

//       return {
//         buffer: fileBuffer,
//         filename: file.originalFilename,
//         mimetype: file.mimetype,
//         folder,
//       };
//     });

//     const processedFiles = await Promise.all(filePromises);

//     // Upload to S3
//     const uploadResults = await Promise.all(
//       processedFiles.map(file => 
//         uploadToS3(file.buffer, file.filename?? '', file.mimetype ?? '', file.folder)
//       )
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Files uploaded successfully',
//       files: uploadResults,
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(500).json({ 
//       error: 'Upload failed', 
//       message: (error as Error).message 
//     });
//   }
// }