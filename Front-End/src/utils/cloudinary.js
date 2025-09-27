// Simple Cloudinary upload function
export const uploadToCloudinary = async (file, folder = 'skill-exchange/general') => {
    try {
        console.log('Starting upload for:', file.name);

        // Create form data (like filling out a form)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'skill_exchange'); // Use your unsigned preset
        formData.append('folder', folder);

        // Your actual Cloudinary cloud name
        const cloudName = 'dwbup2vci';

        // Send to Cloudinary using your cloud name
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary error response:', errorData);
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const result = await response.json();
        console.log('Upload successful:', result);
        return result;
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

