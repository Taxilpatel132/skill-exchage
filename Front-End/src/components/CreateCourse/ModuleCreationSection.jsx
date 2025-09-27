import React, { useState } from 'react';

const ModuleCreationSection = ({ modules = [], setModules, errors }) => {
    const [currentModule, setCurrentModule] = useState({
        title: '',
        description: '',
        duration: '',
        order: 1,
        videoUrl: '',
        resources: [],
        isActive: true
    });

    const [showAddModule, setShowAddModule] = useState(false);
    const [currentResource, setCurrentResource] = useState({
        title: '',
        url: '',
        type: 'link'
    });

    // File upload states
    const [selectedFiles, setSelectedFiles] = useState({
        moduleVideo: null,
        resourceFile: null
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const resourceTypes = [
        { value: 'pdf', label: 'PDF Document', icon: '📄' },
        { value: 'video', label: 'Video', icon: '🎥' },
        { value: 'quiz', label: 'Quiz', icon: '❓' },
        { value: 'link', label: 'External Link', icon: '🔗' }
    ];

    // Validation function
    const validateModule = (module) => {
        const errors = {};
        if (!module.title.trim()) errors.title = 'Module title is required';
        if (!module.description.trim()) errors.description = 'Module description is required';
        if (!module.duration.trim()) errors.duration = 'Module duration is required';
        return errors;
    };

    const validateResource = (resource) => {
        const errors = {};
        if (!resource.title.trim()) errors.title = 'Resource title is required';
        if (!resource.url.trim()) errors.url = 'Resource URL is required';
        // Basic URL validation
        try {
            new URL(resource.url);
        } catch {
            errors.url = 'Please enter a valid URL';
        }
        return errors;
    };

    // File upload functions
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

    const uploadToCloudinary = async (file, folder) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'skill_exchange'); // Use your unsigned preset
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

            return await response.json();
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const uploadModuleVideo = async () => {
        const file = selectedFiles.moduleVideo;
        if (!file) {
            alert('Please select a video file first!');
            return;
        }

        setUploading(true);
        setUploadProgress('Uploading video...');

        try {
            // Fix: Use correct folder structure
            const result = await uploadToCloudinary(file, 'skill-exchange/course-videos');

            setCurrentModule(prev => ({
                ...prev,
                videoUrl: result.secure_url
            }));

            setUploadProgress('Video uploaded successfully! ✓');
            setSelectedFiles(prev => ({ ...prev, moduleVideo: null }));

            // Reset file input
            const fileInput = document.querySelector('input[type="file"][data-upload="moduleVideo"]');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Video upload failed:', error);
            setUploadProgress('Video upload failed. Please try again.');
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(''), 3000);
        }
    };

    const uploadResourceFile = async () => {
        const file = selectedFiles.resourceFile;
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        setUploading(true);
        setUploadProgress('Uploading resource...');

        try {
            // Fix: Use correct folder structure based on file type
            let folder = 'skill-exchange/course-resources';
            if (file.type.startsWith('video/')) {
                folder = 'skill-exchange/course-videos';
            } else if (file.type === 'application/pdf') {
                folder = 'skill-exchange/course-documents';
            }

            const result = await uploadToCloudinary(file, folder);

            setCurrentResource(prev => ({
                ...prev,
                url: result.secure_url,
                title: prev.title || file.name.split('.')[0]
            }));

            setUploadProgress('Resource uploaded successfully! ✓');
            setSelectedFiles(prev => ({ ...prev, resourceFile: null }));

            // Reset file input
            const fileInput = document.querySelector('input[type="file"][data-upload="resourceFile"]');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Resource upload failed:', error);
            setUploadProgress('Resource upload failed. Please try again.');
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(''), 3000);
        }
    };

    const handleModuleInputChange = (field, value) => {
        setCurrentModule(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleResourceInputChange = (field, value) => {
        setCurrentResource(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addResource = () => {
        const resourceErrors = validateResource(currentResource);
        if (Object.keys(resourceErrors).length === 0) {
            setCurrentModule(prev => ({
                ...prev,
                resources: [...prev.resources, { ...currentResource, id: Date.now() }]
            }));
            setCurrentResource({ title: '', url: '', type: 'link' });
            setValidationErrors({});
        } else {
            setValidationErrors({ resource: resourceErrors });
        }
    };

    const removeResource = (resourceId) => {
        setCurrentModule(prev => ({
            ...prev,
            resources: prev.resources.filter(resource => resource.id !== resourceId)
        }));
    };

    const addModule = () => {
        const moduleErrors = validateModule(currentModule);
        if (Object.keys(moduleErrors).length === 0) {
            const newModule = {
                ...currentModule,
                id: Date.now(),
                order: (Array.isArray(modules) ? modules.length : 0) + 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Use callback function to ensure proper state update
            setModules(prev => {
                // Ensure prev is always an array
                const prevModules = Array.isArray(prev) ? prev : [];
                const updatedModules = [...prevModules, newModule];
                console.log('Adding module:', newModule);
                console.log('Updated modules:', updatedModules);
                return updatedModules;
            });

            // Reset form
            setCurrentModule({
                title: '',
                description: '',
                duration: '',
                order: (Array.isArray(modules) ? modules.length : 0) + 2,
                videoUrl: '',
                resources: [],
                isActive: true
            });
            setShowAddModule(false);
            setValidationErrors({});
        } else {
            setValidationErrors({ module: moduleErrors });
        }
    };

    const removeModule = (moduleId) => {
        setModules(prev => {
            const prevModules = Array.isArray(prev) ? prev : [];
            return prevModules.filter(module => module.id !== moduleId);
        });
    };

    const moveModule = (moduleId, direction) => {
        if (!Array.isArray(modules)) return;

        const moduleIndex = modules.findIndex(m => m.id === moduleId);
        if (
            (direction === 'up' && moduleIndex > 0) ||
            (direction === 'down' && moduleIndex < modules.length - 1)
        ) {
            const newModules = [...modules];
            const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
            [newModules[moduleIndex], newModules[targetIndex]] = [newModules[targetIndex], newModules[moduleIndex]];

            // Update order numbers
            newModules.forEach((module, index) => {
                module.order = index + 1;
            });

            setModules(newModules);
        }
    };

    const toggleModuleStatus = (moduleId) => {
        setModules(prev => {
            const prevModules = Array.isArray(prev) ? prev : [];
            return prevModules.map(module =>
                module.id === moduleId
                    ? { ...module, isActive: !module.isActive, updatedAt: new Date() }
                    : module
            );
        });
    };

    // Ensure modules is always an array
    const safeModules = Array.isArray(modules) ? modules : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Course Modules</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Create and organize your course content into structured modules
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowAddModule(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <span className="mr-2 text-lg">➕</span>
                    Add Module
                </button>
            </div>

            {/* Existing Modules */}
            <div className="space-y-4">
                {safeModules.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 text-4xl mb-2">📚</div>
                        <p className="text-gray-600">No modules added yet</p>
                        <p className="text-sm text-gray-500">Click "Add Module" to get started</p>
                    </div>
                ) : (
                    safeModules.map((module, index) => (
                        <div key={module.id} className={`bg-gray-50 rounded-lg p-4 border ${!module.isActive ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-medium text-gray-900">
                                            Module {module.order}: {module.title}
                                        </h4>
                                        <span className={`px-2 py-1 rounded-full text-xs ${module.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {module.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                        <span>⏱️ Duration: {module.duration}</span>
                                        {module.resources.length > 0 && (
                                            <span>📎 {module.resources.length} resource(s)</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleModuleStatus(module.id)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                        title={module.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {module.isActive ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveModule(module.id, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveModule(module.id, 'down')}
                                        disabled={index === modules.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeModule(module.id)}
                                        className="p-1 text-red-400 hover:text-red-600"
                                    >
                                        <span className="text-sm">🗑️</span>
                                    </button>
                                </div>
                            </div>
                            {module.videoUrl && (
                                <div className="text-xs text-blue-600 mb-2 flex items-center">
                                    <span className="mr-1">🎥</span>
                                    <a href={module.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {module.videoUrl}
                                    </a>
                                </div>
                            )}
                            {module.resources.length > 0 && (
                                <div className="mt-2">
                                    <div className="text-xs font-medium text-gray-700 mb-1">Resources:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {module.resources.map((resource, idx) => (
                                            <span key={idx} className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {resourceTypes.find(t => t.value === resource.type)?.icon || '🔗'}
                                                <span className="ml-1">{resource.title}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Module Form */}
            {showAddModule && (
                <div className="bg-white border rounded-lg p-6 space-y-4">
                    <h4 className="font-medium text-gray-900">Add New Module</h4>

                    {/* Module validation errors */}
                    {validationErrors.module && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                            <h5 className="text-red-800 font-medium text-sm mb-1">Module Errors:</h5>
                            <ul className="text-red-600 text-sm space-y-1">
                                {Object.entries(validationErrors.module).map(([field, message]) => (
                                    <li key={field}>• {message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Module Title *
                            </label>
                            <input
                                type="text"
                                value={currentModule.title}
                                onChange={(e) => handleModuleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter module title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration *
                            </label>
                            <input
                                type="text"
                                value={currentModule.duration}
                                onChange={(e) => handleModuleInputChange('duration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., 2 hours"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Module Description *
                        </label>
                        <textarea
                            value={currentModule.description}
                            onChange={(e) => handleModuleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Describe what students will learn in this module"
                        />
                    </div>

                    {/* Video Upload Section */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h5 className="font-medium text-gray-900 mb-3">Module Video</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Video URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={currentModule.videoUrl}
                                    onChange={(e) => handleModuleInputChange('videoUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Or Upload Video File
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        data-upload="moduleVideo"
                                        onChange={(e) => handleFileSelect(e, 'moduleVideo')}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={uploadModuleVideo}
                                        disabled={!selectedFiles.moduleVideo || uploading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>

                        {uploadProgress && (
                            <p className="text-sm text-blue-600 mt-2">{uploadProgress}</p>
                        )}
                    </div>

                    {/* Resources Section */}
                    <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-900 mb-3">Module Resources</h5>

                        {/* Resource validation errors */}
                        {validationErrors.resource && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                                <h6 className="text-red-800 font-medium text-sm mb-1">Resource Errors:</h6>
                                <ul className="text-red-600 text-sm space-y-1">
                                    {Object.entries(validationErrors.resource).map(([field, message]) => (
                                        <li key={field}>• {message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Add Resource Form */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={currentResource.title}
                                    onChange={(e) => handleResourceInputChange('title', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Resource title"
                                />
                                <input
                                    type="url"
                                    value={currentResource.url}
                                    onChange={(e) => handleResourceInputChange('url', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Resource URL"
                                />
                                <select
                                    value={currentResource.type}
                                    onChange={(e) => handleResourceInputChange('type', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    {resourceTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload Option */}
                            <div className="flex gap-2 items-center">
                                <span className="text-sm text-gray-600">Or upload file:</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov"
                                    data-upload="resourceFile"
                                    onChange={(e) => handleFileSelect(e, 'resourceFile')}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={uploadResourceFile}
                                    disabled={!selectedFiles.resourceFile || uploading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                                >
                                    Upload
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={addResource}
                                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                Add Resource
                            </button>
                        </div>

                        {/* Current Module Resources */}
                        {currentModule.resources.length > 0 && (
                            <div className="space-y-2">
                                {currentModule.resources.map((resource) => (
                                    <div key={resource.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-500">
                                                {resourceTypes.find(t => t.value === resource.type)?.icon || '🔗'}
                                            </span>
                                            <span className="text-sm font-medium">{resource.title}</span>
                                            <span className="text-xs text-gray-500">({resource.type})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeResource(resource.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <span className="text-sm">🗑️</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={addModule}
                            disabled={uploading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {uploading ? 'Processing...' : 'Add Module'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddModule(false);
                                setCurrentModule({
                                    title: '',
                                    description: '',
                                    duration: '',
                                    order: modules.length + 1,
                                    videoUrl: '',
                                    resources: [],
                                    isActive: true
                                });
                                setValidationErrors({});
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Validation Errors */}
            {errors && Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
                    <ul className="text-red-600 text-sm space-y-1">
                        {Object.entries(errors).map(([field, message]) => (
                            <li key={field}>• {message}</li>
                        ))}
                    </ul>
                </div>
            )}

            {safeModules.length > 0 && (
                <div className="text-sm text-gray-500 text-center pt-4 border-t">
                    Total modules: {safeModules.length} | Active: {safeModules.filter(m => m.isActive).length}
                </div>
            )}
        </div>
    );
};

export default ModuleCreationSection;