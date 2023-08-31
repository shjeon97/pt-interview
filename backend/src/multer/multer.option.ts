import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync, unlink } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const multerOption = {
  fileFilter: (_, file, callback) => {
    if (
      file.mimetype.match(/\/(jpg|jpeg|png)$/) ||
      file.mimetype === 'image/svg+xml'
    ) {
      // 이미지 형식은 jpg, jpeg, png,svg만 허용합니다.
      callback(null, true);
    } else {
      callback(
        new HttpException(
          '이미지 형식은 jpg, jpeg, png, svg 만 허용합니다.',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  storage: diskStorage({
    destination: (_, __, callback) => {
      const uploadPath = 'public//upload';

      if (!existsSync(uploadPath)) {
        // upload 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (_, file, callback) => {
      callback(null, uuid(file) + extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //5mb
};

export const deleteImageFile = (image: string): void => {
  // 파일이 저장되는 경로: 폴더경로/../upload 폴더
  // 위의 조건에 따라 파일의 경로를 생성해줍니다.
  const imagePath = `${__dirname}/../../public/upload/${image}`;

  const exists = existsImageFile(image);

  if (exists) {
    unlink(imagePath, function (error) {
      if (error) {
        console.log('Error:', error);
      }
    });
  }
};

export const existsImageFile = (image: string): boolean => {
  const imagePath = `${__dirname}/../../public/upload/${image}`;
  return existsSync(imagePath);
};

export const selectImageUrl = (image: string): string => {
  return `${process.env.SERVER_ADDRESS}/../public/upload/${image}`;
};
