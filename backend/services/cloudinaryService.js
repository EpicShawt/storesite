const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
  // Upload image to Cloudinary
  async uploadImage(file, options = {}) {
    try {
      // Process image with Sharp
      const processedImageBuffer = await sharp(file.buffer)
        .resize(800, 800, { 
          fit: 'cover',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 80,
          progressive: true 
        })
        .toBuffer();

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'asurwears/products',
            resource_type: 'image',
            transformation: [
              { width: 800, height: 800, crop: 'fill' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ],
            ...options
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(processedImageBuffer);
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        cloudinaryUrl: result.secure_url,
        width: result.width,
        height: result.height,
        size: result.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  // Generate optimized URL
  generateOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
      width: 800,
      height: 800,
      crop: 'fill',
      quality: 'auto:good',
      fetch_format: 'auto'
    };

    const transformation = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, { transformation });
  }

  // Get image info
  async getImageInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        size: result.bytes,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary get info error:', error);
      return null;
    }
  }
}

module.exports = new CloudinaryService(); 