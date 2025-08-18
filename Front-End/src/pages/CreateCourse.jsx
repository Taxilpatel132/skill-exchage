import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceInPoints: 10,
        categories: [],
        tags: [],
        thumbnail: null,
        sessionDetails: {
            date: '',
            startTime: '',
            endTime: '',
            duration: 0
        },
        fileResources: []
    });
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const categoryOptions = ["Programming", "Design", "Marketing", "Business", "Other"];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'categories') {
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    categories: [...prev.categories, value]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    categories: prev.categories.filter(cat => cat !== value)
                }));
            }
        } else if (name.startsWith('session.')) {
            const sessionField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                sessionDetails: {
                    ...prev.sessionDetails,
                    [sessionField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }));
        }
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In real app, upload to server and get URL
            const thumbnailUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                thumbnail: thumbnailUrl
            }));
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleFileResourceUpload = (e) => {
        const files = Array.from(e.target.files);
        const newResources = files.map(file => ({
            filename: file.name,
            url: URL.createObjectURL(file),
            type: getFileType(file.name)
        }));

        setFormData(prev => ({
            ...prev,
            fileResources: [...prev.fileResources, ...newResources]
        }));
    };

    const getFileType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(extension)) return 'pdf';
        if (['mp4', 'avi', 'mov'].includes(extension)) return 'video';
        if (['ppt', 'pptx'].includes(extension)) return 'ppt';
        if (['doc', 'docx'].includes(extension)) return 'docx';
        return 'other';
    };

    const removeFileResource = (index) => {
        setFormData(prev => ({
            ...prev,
            fileResources: prev.fileResources.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.categories.length === 0) newErrors.categories = 'Select at least one category';
        if (formData.tags.length === 0) newErrors.tags = 'Add at least one tag';
        if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail is required';
        if (!formData.sessionDetails.date) newErrors.sessionDate = 'Session date is required';
        if (!formData.sessionDetails.startTime) newErrors.sessionStartTime = 'Start time is required';
        if (!formData.sessionDetails.endTime) newErrors.sessionEndTime = 'End time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Calculate duration
            const duration = calculateDuration(formData.sessionDetails.startTime, formData.sessionDetails.endTime);
            const courseData = {
                ...formData,
                sessionDetails: {
                    ...formData.sessionDetails,
                    duration
                }
            };

            console.log('Creating course:', courseData);
            // API call would go here

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating course:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(`2000-01-01 ${startTime}`);
        const end = new Date(`2000-01-01 ${endTime}`);
        return Math.abs(end - start) / (1000 * 60); // duration in minutes
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-cyan-400 px-6 py-8">
                            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Create New Course
                            </h1>
                            <p className="text-indigo-100 mt-2">Share your expertise with the world</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                    Basic Information
                                </h2>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                            }`}
                                        placeholder="Enter course title"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 resize-none ${errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                            }`}
                                        placeholder="Describe your course content and learning outcomes"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (Points)
                                    </label>
                                    <input
                                        type="number"
                                        name="priceInPoints"
                                        value={formData.priceInPoints}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                                    />
                                </div>
                            </div>

                            {/* Categories and Tags */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                    Categories & Tags
                                </h2>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Categories * (Select all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {categoryOptions.map(category => (
                                            <label key={category} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="categories"
                                                    value={category}
                                                    checked={formData.categories.includes(category)}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags *
                                    </label>
                                    <div className="flex space-x-2 mb-3">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            placeholder="Add a tag and press Enter"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                                                <span>#{tag}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                                </div>
                            </div>

                            {/* Thumbnail */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                    Course Thumbnail
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Thumbnail *
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-200">
                                        {formData.thumbnail ? (
                                            <div className="space-y-3">
                                                <img src={formData.thumbnail} alt="Thumbnail" className="mx-auto h-32 w-48 object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                            id="thumbnail-upload"
                                        />
                                        <label htmlFor="thumbnail-upload" className="cursor-pointer inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                                            Choose File
                                        </label>
                                    </div>
                                    {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
                                </div>
                            </div>




                            {/* File Resources */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                    Course Resources
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Files (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileResourceUpload}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                    />

                                    {formData.fileResources.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {formData.fileResources.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`px-2 py-1 text-xs rounded ${file.type === 'pdf' ? 'bg-red-100 text-red-800' :
                                                            file.type === 'video' ? 'bg-blue-100 text-blue-800' :
                                                                file.type === 'ppt' ? 'bg-orange-100 text-orange-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {file.type.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm text-gray-700">{file.filename}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFileResource(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-400 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Creating Course...</span>
                                        </>
                                    ) : (
                                        <span>Create Course</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCourse;