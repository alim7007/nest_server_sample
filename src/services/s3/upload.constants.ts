import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiEC, ApiException } from 'src/exceptions';

export const uploadConstants = {
    maxFileSize: 5000000, // in bytes
    maxFieldSize: 5000000, // in bytes
    maxFiles: 10,
    minThumbnailSize: 5000,
    thumbnailWidth: 200,
    thumbnailHeight: 200,
    mimetypes: ['image/png', 'image/jpeg'],
};

export const uploadFolders = {
    userAvatars: 'avatars',
    thumbnails: 'thumbnails',
};

export const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
    if (uploadConstants.mimetypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiException(ApiEC.WrongImageFormat), false);
    }
};

export const uploadImageParams: MulterOptions = {
    limits: { fileSize: uploadConstants.maxFileSize },
    fileFilter: imageFileFilter,
};