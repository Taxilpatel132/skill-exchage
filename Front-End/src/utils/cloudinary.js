// Simple Cloudinary upload function
export const uploadToCloudinary = async (file, folder = 'course-uploads') => {
    try {
        console.log('Starting upload for:', file.name);

        // Create form data (like filling out a form)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'skill_exchange_uploads'); // You'll create this preset
        formData.append('folder', folder);

        // Send to Cloudinary using your cloud name
        const response = await fetch(
            'https://api.cloudinary.com/v1_1/dwbup2vci/upload', // Your cloud name
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Upload successful:', data.secure_url);

        return {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width || 0,
            height: data.height || 0,
            size: data.bytes,
            format: data.format,
            originalName: file.name
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
    const {
        width = 'auto',
        height = 'auto',
        crop = 'fill',
        quality = 'auto',
        format = 'auto'
    } = options;

    return `https://res.cloudinary.com/dwbup2vci/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
};
