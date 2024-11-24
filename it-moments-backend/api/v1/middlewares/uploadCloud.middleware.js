import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import 'dotenv/config';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Hàm tải lên Cloudinary
const uploadToCloudinary = (file, resource_type = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type }, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const upload = async (req, res, next) => {
  console.log('Bắt đầu xử lý tải lên...');

  // Xử lý thumbnail
  if (req.files?.thumbnail?.[0]) {
    const thumbnail = req.files.thumbnail[0];
    try {
      const result = await uploadToCloudinary(thumbnail);
      req.body.thumbnail = result.secure_url;
      console.log('Tải lên thumbnail thành công:', result.secure_url);
    } catch (error) {
      console.error('Lỗi tải lên thumbnail:', error);
      return next(error);
    }
  } else {
    console.log('Không tìm thấy thumbnail để tải lên');
  }

  // Xử lý images
  if (req.files?.images) {
    const images = req.files.images;
    try {
      const results = await Promise.all(images.map(file => uploadToCloudinary(file)));
      req.body.images = results.map(result => result.secure_url);
      console.log('Tải lên images thành công:', req.body.images);
    } catch (error) {
      console.error('Lỗi tải lên images:', error);
      return next(error);
    }
  } else {
    console.log('Không tìm thấy images để tải lên');
  }

  // Xử lý avatar
  if (req.files?.avatar?.[0]) {
    const avatar = req.files.avatar[0];
    try {
      const result = await uploadToCloudinary(avatar);
      req.body.avatar = result.secure_url;
      console.log('URL Avatar sau khi tải lên:', req.body.avatar);
    } catch (error) {
      console.error('Lỗi tải lên avatar:', error);
      return next(error);
    }
  } else {
    console.log('Không tìm thấy avatar để tải lên');
  }

  next();
};
