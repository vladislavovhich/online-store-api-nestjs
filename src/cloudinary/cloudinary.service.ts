import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { cloudinary } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return await cloudinary.uploader.upload(file.path, {folder: process.env.CLOUDINARY_FOLDER_NAME})
      }
}
