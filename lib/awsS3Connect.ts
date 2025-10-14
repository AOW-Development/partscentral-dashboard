import { error, log } from "node:console";

const { S3Client,DeleteObjectCommand, GetObjectCommand, ListObjectv2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectsCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const { Upload } = require('@aws-sdk/lib-storage');

 // Initialize a s3 client 
 const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
 });


const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function uploadToS3(fileBuffer:Buffer,fileName:String,mimeType:string, folder='') {
   try {
      const timeStamp = Date.now();
      const key = folder ? `${folder}/${timeStamp}-${fileName}` : `${timeStamp}-${fileName}`;
      const uploadParams = {
         Bucket: BUCKET_NAME,
         Key: key,
         Body: fileBuffer,
         ContentType: mimeType,
      };

      // for large files, use the Upload class for multipart upload
      const parallelUploads3 = new Upload({
         client: s3Client,
         params: uploadParams,
      });
      const result = await parallelUploads3.done();

      return {
         success: true,
         key: key,
         location: result.Location,
         bucket: BUCKET_NAME,
         etag: result.ETag
      }
   }
   catch(error) {
      console.error("Error uploading file to S3", error);
      throw new Error(`S3 upload Error :  ${(error as Error).message}`);
   }
}


export async function uploadMultipleToS3(files :  Array<{ buffer: Buffer; filename: string; mimetype: string }>, folder='') {
   try {
      const uploadPromises = files.map(file=>uploadToS3(file.buffer, file.filename, file.mimetype, folder));
      const results = await Promise.all(uploadPromises)
      return results ; 

   } catch (error) {
      console.error("Error uploading multiple files to S3", error);
      throw Error;
   }
}


// Get a file from s3 
async function getFromS3(key : String) {
   try{
      const command =new GetObjectCommand({
         Bucket: BUCKET_NAME,
         Key: key
      });
      const response = await s3Client.send(command);

      // convertin stram to bufer ..
      const chunks = [];
      for await(const chunk of response.Body) {
         chunks.push(chunk);
      }
      return Buffer.concat(chunks)
   } 
   catch(error) {
      console.error("Error getting file from S3", error);
      throw new Error(`S3 get Error :  ${(error as Error).message}`);
   }
}

// generrate a presigned url to access a file in s3 for direct access or downlaodiong it
async function getPresignedUrl(key : String, expiresIn=3600) {
   try {
      const command = new GetObjectCommand({
         Bucket: BUCKET_NAME,
         Key: key
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
   }
   catch (error) {
      console.error("Error generating presigned URL", error);
      throw new Error(`S3 presigned URL Error :  ${(error as Error).message}`);
   }

}

// delete a file from s3
async function deleteFromS3(key : String) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    
    return {
      success: true,
      message: `File ${key} deleted successfully`,
    };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error(`S3 Delete Error: ${(error as Error).message}`);
  }
}


// check if file exists in s3 
async function fileExists(key : String) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    if ((error as Error).name === 'NoSuchKey') {
      return false;
    }
    throw error;
  }
}


module.exports = { 
  s3Client,
  uploadToS3,
  uploadMultipleToS3,
  getFromS3,
  getPresignedUrl,
  deleteFromS3,
  fileExists,
  BUCKET_NAME,
}