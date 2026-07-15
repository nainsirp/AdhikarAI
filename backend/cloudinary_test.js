const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary using the inline credentials provided
cloudinary.config({
  cloud_name: 'fcwcbyls',
  api_key: '144211767154183',
  api_secret: 'fb4wRgOWMYmzlnHCXrDc6RHUk7k'
});

async function run() {
  try {
    console.log('Uploading sample image to Cloudinary...');
    
    // 2. Upload sample image from Cloudinary's demo domain
    const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', {
      folder: 'onboarding_test'
    });

    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 3. Print image metadata details
    console.log('Width:', uploadResult.width);
    console.log('Height:', uploadResult.height);
    console.log('Format:', uploadResult.format);
    console.log('File Size (bytes):', uploadResult.bytes);

    // 4. Transform the image
    // f_auto (fetch_format: 'auto') -> Automatically chooses the best format (WebP/AVIF) based on browser support.
    // q_auto (quality: 'auto') -> Adjusts quality compression levels dynamically for the best byte-to-visual balance.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });

    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);

  } catch (error) {
    console.error('Cloudinary operation failed:', error);
  }
}

run();
