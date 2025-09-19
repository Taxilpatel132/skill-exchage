import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
            // Dynamically import the upload function
            const { uploadToCloudinary } = await import('../utils/cloudinary');

            const result = await uploadToCloudinary(file, `course-${fileType}s`);

            // Update form data with the Cloudinary URL
            if (fileType === 'thumbnail') {
                setFormData(prev => ({ ...prev, thumbnail: result.url }));
            }

            console.log(`${fileType} uploaded:`, result.url);
            setUploadProgress(`${fileType} uploaded successfully! ✓`);

            // Clear the file selection after successful upload
            setSelectedFiles(prev => ({ ...prev, [fileType]: null }));

            // Show success message
            alert(`${fileType} uploaded successfully!`);

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
                targetAudience: formData.targetAudience.filter(audience => audience.trim())
            };

            // Remove the old field name
            delete courseData.pricePoints;

            console.log('Sending course data:', courseData);

            // Send to your backend API using fetch
            const response = await fetch('http://localhost:3000/courses', {
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>

                                    {/* URL Input */}
                                    <input
                                        type="url"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />

                                    {/* Cloudinary Upload Section */}
                                    <div className="p-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-blue-700 mb-3">☁️ Or upload to Cloudinary</p>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, 'thumbnail')}
                                                className="mb-3 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                disabled={uploading}
                                            />

                                            {selectedFiles.thumbnail && (
                                                <div className="mb-3">
                                                    <p className="text-sm text-green-600 mb-2">✓ Selected: {selectedFiles.thumbnail.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => uploadFile('thumbnail')}
                                                        disabled={uploading}
                                                        className={`px-4 py-2 rounded-lg text-white font-medium ${uploading
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-500 hover:bg-blue-600'
                                                            }`}
                                                    >
                                                        {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
                                                    </button>
                                                </div>
                                            )}

                                            {uploadProgress && (
                                                <p className={`text-sm ${uploadProgress.includes('failed') ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {uploadProgress}
                                                </p>
                                            )}

                                            {formData.thumbnail && formData.thumbnail.includes('cloudinary') && (
                                                <div className="mt-3">
                                                    <p className="text-xs text-green-600 mb-2">Uploaded to Cloudinary ✓</p>
                                                    <img
                                                        src={formData.thumbnail}
                                                        alt="Thumbnail preview"
                                                        className="mx-auto w-24 h-16 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

                        {/* Learning Objectives */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-400 rounded-full mr-3"></div>
                                Learning Objectives
                            </h2>

                            <div className="space-y-4">
                                {formData.learningObjectives.map((objective, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={objective}
                                            onChange={(e) => handleArrayInputChange(idx, 'learningObjectives', e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="What will students learn?"
                                        />
                                        {formData.learningObjectives.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem(idx, 'learningObjectives')}
                                                className="px-3 py-3 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('learningObjectives')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    + Add Learning Objective
                                </button>
                            </div>
                        </div>

                        {/* Prerequisites */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-400 rounded-full mr-3"></div>
                                Prerequisites
                            </h2>

                            <div className="space-y-4">
                                {formData.prerequisites.map((prereq, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={prereq}
                                            onChange={(e) => handleArrayInputChange(idx, 'prerequisites', e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="What should students know beforehand?"
                                        />
                                        {formData.prerequisites.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem(idx, 'prerequisites')}
                                                className="px-3 py-3 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('prerequisites')}
                                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                                >
                                    + Add Prerequisite
                                </button>
                            </div>
                        </div>

                        {/* Course Highlights */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full mr-3"></div>
                                Course Highlights
                            </h2>

                            <div className="space-y-4">
                                {formData.courseHighlights.map((highlight, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={highlight}
                                            onChange={(e) => handleArrayInputChange(idx, 'courseHighlights', e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Special features or benefits"
                                        />
                                        {formData.courseHighlights.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem(idx, 'courseHighlights')}
                                                className="px-3 py-3 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('courseHighlights')}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                                >
                                    + Add Highlight
                                </button>
                            </div>
                        </div>

                        {/* Tools */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-blue-400 rounded-full mr-3"></div>
                                Tools & Technologies
                            </h2>

                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    value={currentTool}
                                    onChange={(e) => setCurrentTool(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Add a tool (e.g., VS Code, Git)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                                />
                                <button
                                    type="button"
                                    onClick={addTool}
                                    className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors duration-200"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.tools.map((tool, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
                                    >
                                        {tool}
                                        <button
                                            type="button"
                                            onClick={() => removeTool(tool)}
                                            className="text-cyan-500 hover:text-cyan-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-full mr-3"></div>
                                Target Audience
                            </h2>

                            <div className="space-y-4">
                                {formData.targetAudience.map((audience, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={audience}
                                            onChange={(e) => handleArrayInputChange(idx, 'targetAudience', e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Who is this course for?"
                                        />
                                        {formData.targetAudience.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem(idx, 'targetAudience')}
                                                className="px-3 py-3 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('targetAudience')}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                >
                                    + Add Target Audience
                                </button>
                            </div>
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