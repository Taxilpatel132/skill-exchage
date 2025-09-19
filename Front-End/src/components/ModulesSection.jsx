import React, { useState } from 'react';

const ModulesSection = ({ modules, isEnrolled }) => {
    const [expandedModule, setExpandedModule] = useState(null);

    const toggleModule = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const getModuleIcon = (type) => {
        switch (type) {
            case 'video':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6" />
                    </svg>
                );
            case 'pdf':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'quiz':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                );
        }
    };

    if (!modules || modules.length === 0) {
        return (
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
                <p className="text-gray-600">No modules available for this course.</p>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
                <div className="text-sm bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-full">
                    {modules.length} Modules
                </div>
            </div>

            <div className="space-y-4">
                {modules.map((module, index) => (
                    <div
                        key={module.id || module._id || index}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors duration-200"
                    >
                        {/* Module Header */}
                        <div
                            className="p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-indigo-50/30 hover:from-indigo-50 hover:to-indigo-100/50 transition-all duration-200"
                            onClick={() => toggleModule(module.id || module._id || index)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-indigo-600">
                                            {module.order || index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {module.title || `Module ${index + 1}`}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {module.duration || 'Duration not specified'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {!isEnrolled && (
                                        <div className="flex items-center gap-1 text-amber-600 text-sm">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">Locked</span>
                                        </div>
                                    )}
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedModule === (module.id || module._id || index) ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Module Content */}
                        {expandedModule === (module.id || module._id || index) && (
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <p className="text-gray-700 mb-4">
                                    {module.description || 'No description available for this module.'}
                                </p>

                                {module.resources && module.resources.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
                                        <div className="space-y-2">
                                            {module.resources.map((resource, resourceIndex) => (
                                                <div
                                                    key={resource.id || resourceIndex}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                        {resource.type === 'video' ? (
                                                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : resource.type === 'pdf' ? (
                                                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : resource.type === 'quiz' ? (
                                                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm5 5a1 1 0 100-2 1 1 0 000 2zm5 1a1 1 0 11-2 0 1 1 0 012 0zm0 4a1 1 0 11-2 0 1 1 0 012 0zm-9 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {resource.title || `Resource ${resourceIndex + 1}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500 capitalize">
                                                            {resource.type || 'resource'}
                                                        </p>
                                                    </div>
                                                    {isEnrolled && (
                                                        <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors duration-200">
                                                            Access
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isEnrolled && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-amber-700 text-sm">
                                            <strong>Enroll in this course</strong> to access module content and resources.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ModulesSection;