import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ModuleCreationSection from '../components/CreateCourse/ModuleCreationSection';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fullDescription: '',
        category: '',
        level: '',
        pricePoints: '',
        duration: '',
        language: 'English',
        thumbnail: '',
        skills: [],
        learningObjectives: [''],
        prerequisites: [''],
        courseHighlights: [''],
        tools: [],
        targetAudience: [''],
        certificate: true,
        modules: []
    });

    const [currentSkill, setCurrentSkill] = useState('');
    const [currentTool, setCurrentTool] = useState('');
    const [errors, setErrors] = useState({});

    // Cloudinary file upload states
    const [selectedFiles, setSelectedFiles] = useState({
        thumbnail: null,
        video: null,
        materials: []
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const categories = ['Programming', 'Design', 'Marketing', 'Business', 'Other'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayInputChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (index, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const addSkill = () => {
        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addTool = () => {
        if (currentTool.trim() && !formData.tools.includes(currentTool.trim())) {
            setFormData(prev => ({
                ...prev,
                tools: [...prev.tools, currentTool.trim()]
            }));
            setCurrentTool('');
        }
    };

    const removeTool = (toolToRemove) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.filter(tool => tool !== toolToRemove)
        }));
    };

    // File selection handler
    const handleFileSelect = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            console.log(`Selected ${fileType}:`, file.name);
            setSelectedFiles(prev => ({
                ...prev,
                [fileType]: file
            }));
        }
    };

    // Upload file to Cloudinary
    const uploadFile = async (fileType) => {
        const file = selectedFiles[fileType];
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        setUploading(true);
        setUploadProgress(`Uploading ${fileType}...`);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'skill_exchange'); // Use your unsigned preset

            // Fix: Use correct folder structure that matches your Cloudinary
            let folder = 'skill-exchange';
            if (fileType === 'thumbnail') {
                folder = 'skill-exchange/course-thumbnails';
            }
            formData.append('folder', folder);

            // Your actual Cloudinary cloud name
            const cloudName = 'dwbup2vci';

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const result = await response.json();

            // Update form data with the Cloudinary URL
            if (fileType === 'thumbnail') {
                setFormData(prev => ({ ...prev, thumbnail: result.secure_url }));
            }

            console.log(`${fileType} uploaded:`, result.secure_url);
            setUploadProgress(`${fileType} uploaded successfully! ✓`);

            // Clear the file selection after successful upload
            setSelectedFiles(prev => ({ ...prev, [fileType]: null }));

        } catch (error) {
            console.error(`${fileType} upload failed:`, error);
            setUploadProgress(`${fileType} upload failed. Please try again.`);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare data for backend (match backend field names)
            const courseData = {
                ...formData,
                priceInPoints: parseInt(formData.pricePoints), // Convert pricePoints to priceInPoints
                learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
                prerequisites: formData.prerequisites.filter(req => req.trim()),
                courseHighlights: formData.courseHighlights.filter(highlight => highlight.trim()),
                targetAudience: formData.targetAudience.filter(audience => audience.trim()),
                // Format modules for backend
                modules: formData.modules.map(module => ({
                    title: module.title,
                    description: module.description,
                    duration: module.duration,
                    order: module.order,
                    videoUrl: module.videoUrl || '',
                    resources: module.resources.map(resource => ({
                        title: resource.title,
                        url: resource.url,
                        type: resource.type
                    })),
                    isActive: module.isActive
                }))
            };

            // Remove the old field name
            delete courseData.pricePoints;

            console.log('Sending course data:', courseData);

            // Send to your backend API using fetch
            const response = await fetch('http://localhost:3000/course/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dummy-jwt-token-12345'
                },
                credentials: 'include',
                body: JSON.stringify(courseData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Course created successfully:', result);
                alert('Course created successfully!');
                navigate('/courses'); // Redirect to courses page
            } else {
                console.error('Failed to create course:', response.data);
                alert(`Failed to create course: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error creating course:', error);

            if (error.response) {
                // Server responded with error status
                alert(`Failed to create course: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                // Request was made but no response received
                alert('Network error. Please check your connection.');
            } else {
                // Something else happened
                alert('Error creating course. Please try again.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
                        <p className="text-gray-600">Share your knowledge and help others learn new skills</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-full mr-3"></div>
                                Basic Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter course title"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Brief description for course cards (150 characters max)"
                                        maxLength={150}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                                    <textarea
                                        name="fullDescription"
                                        value={formData.fullDescription}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Detailed course description for the course page"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select level</option>
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Points)</label>
                                    <input
                                        type="number"
                                        name="pricePoints"
                                        value={formData.pricePoints}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="100"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g., 8 Weeks • ~60 hrs"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                    <input
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="English"
                                    />
                                </div>



                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="certificate"
                                            checked={formData.certificate}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">Include completion certificate</span>
                                    </label>
                                </div>
                            </div>

                            {/* Thumbnail Upload Section */}
                            <div className="md:col-span-2 mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileSelect(e, 'thumbnail')}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => uploadFile('thumbnail')}
                                        disabled={!selectedFiles.thumbnail || uploading}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Upload
                                    </button>
                                </div>
                                {formData.thumbnail && (
                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-800 text-sm">✓ Thumbnail uploaded successfully</p>
                                        <img
                                            src={formData.thumbnail}
                                            alt="Course thumbnail"
                                            className="mt-2 w-32 h-20 object-cover rounded"
                                        />
                                    </div>
                                )}
                                {uploadProgress && (
                                    <p className="text-sm text-blue-600 mt-2">{uploadProgress}</p>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-teal-400 rounded-full mr-3"></div>
                                Skills Covered
                            </h2>

                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Add a skill (e.g., React, Node.js)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Course Modules Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full mr-3"></div>
                                Course Modules
                            </h2>

                            <ModuleCreationSection
                                modules={formData.modules || []}
                                setModules={(modules) => {
                                    console.log('Setting modules in parent:', modules);
                                    // Ensure we're always setting an array
                                    const safeModules = Array.isArray(modules) ? modules :
                                        typeof modules === 'function' ? modules(formData.modules || []) : [];
                                    setFormData(prev => ({ ...prev, modules: safeModules }));
                                }}
                                errors={errors}
                            />
                        </div>










                        {/* Submit Button */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Create Course
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Save Draft
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCourse;