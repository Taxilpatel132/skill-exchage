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
                        key={module.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors duration-200"
                    >
                        {/* Module Header */}
                        <div
                            className="p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => toggleModule(module.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {module.duration}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span>{module.resources.length} Resources</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isEnrolled && (
                                        <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all duration-200">
                                            Start Module
                                        </button>
                                    )}
                                    <div className={`transform transition-transform duration-200 ${expandedModule === module.id ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Module Content */}
                        {expandedModule === module.id && (
                            <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/50">
                                <div className="pt-4">
                                    <p className="text-gray-600 mb-4">{module.description}</p>

                                    {/* Module Resources */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
                                        {module.resources.map((resource, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                        {getModuleIcon(resource.type)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{resource.title}</div>
                                                        <div className="text-sm text-gray-500 capitalize">{resource.type}</div>
                                                    </div>
                                                </div>
                                                {isEnrolled ? (
                                                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                                                        Open
                                                    </button>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Video Player Preview */}
                                    {module.videoUrl && (
                                        <div className="mt-4">
                                            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {isEnrolled ? (
                                                        <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                                                                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-white/80 text-sm">Enroll to access video content</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ModulesSection;