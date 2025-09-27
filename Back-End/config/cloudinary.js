const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection successful:', result);
    } catch (error) {
        console.error('Cloudinary connection failed:', error);
    }
};

testCloudinaryConnection();

// Configure multer storage for profile photos
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'skill-exchange/profile-photos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ]
    }
});

// Configure multer storage for course content
const courseStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        let folder = 'skill-exchange/courses';
        let resourceType = 'auto';

        // Determine folder and resource type based on file type
        if (file.fieldname === 'thumbnail') {
            folder = 'skill-exchange/course-thumbnails';
            resourceType = 'image';
        } else if (file.fieldname === 'moduleVideo' || file.mimetype.startsWith('video/')) {
            folder = 'skill-exchange/course-videos';
            resourceType = 'video';
        } else if (file.mimetype === 'application/pdf') {
            folder = 'skill-exchange/course-documents';
            resourceType = 'raw';
        }

        return {
            folder: folder,
            resource_type: resourceType,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'mov', 'pdf', 'doc', 'docx', 'ppt', 'pptx'],
            transformation: resourceType === 'image' ? [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' }
            ] : undefined
        };
    }
});

const profileUpload = multer({
    storage: profileStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('File filter - mimetype:', file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const courseUpload = multer({
    storage: courseStorage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for course content
    },
    fileFilter: (req, file, cb) => {
        console.log('Course file filter - mimetype:', file.mimetype);
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/avi', 'video/quicktime',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed!'), false);
        }
    }
});

module.exports = {
    cloudinary,
    upload: profileUpload,
    courseUpload
};
