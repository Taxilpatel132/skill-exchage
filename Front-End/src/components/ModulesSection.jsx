import React, { useState } from 'react';

const ModulesSection = ({ modules, isEnrolled, course, isAdvisor }) => {
    const [expandedModule, setExpandedModule] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);

    const toggleModule = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const openVideoModal = (videoUrl, title) => {
        if ((isEnrolled || isAdvisor) && videoUrl) {
            setCurrentVideo({ url: videoUrl, title });
        }
    };

    const closeVideoModal = () => {
        setCurrentVideo(null);
    };

    const ResourceIcon = ({ type }) => {
        const icons = {
            pdf: '📄',
            video: '🎥',
            quiz: '❓',
            link: '🔗'
        };
        return <span className="text-sm">{icons[type] || '🔗'}</span>;
    };

    return (
        <>
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>

                {modules && modules.length > 0 ? (
                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                            <p className="text-sm text-gray-600">{module.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {module.videoUrl && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="mr-1">🎥</span>
                                                <span>Video</span>
                                            </div>
                                        )}
                                        {module.resources && module.resources.length > 0 && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="mr-1">📎</span>
                                                <span>{module.resources.length}</span>
                                            </div>
                                        )}
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${expandedModule === module.id ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {expandedModule === module.id && (
                                    <div className="px-6 py-4 bg-white border-t">
                                        <p className="text-gray-700 mb-4">{module.description}</p>

                                        {/* Video Section */}
                                        {module.videoUrl && (
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900 flex items-center">
                                                        <span className="mr-2">🎥</span>Module Video
                                                    </h4>
                                                    {(isEnrolled || isAdvisor) && (
                                                        <button
                                                            onClick={() => openVideoModal(module.videoUrl, module.title)}
                                                            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                                        >
                                                            {isAdvisor ? 'Preview Video' : 'Watch Video'}
                                                        </button>
                                                    )}
                                                </div>
                                                {!isEnrolled && !isAdvisor && (
                                                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                                                        <p className="text-gray-600 text-sm">
                                                            🔒 Enroll in this course to access module videos
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Resources Section */}
                                        {module.resources && module.resources.length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                                    <span className="mr-2">📎</span>Resources
                                                </h4>
                                                <div className="space-y-2">
                                                    {module.resources.map((resource, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <ResourceIcon type={resource.type} />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {resource.title}
                                                                </span>
                                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                                                    {resource.type.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            {(isEnrolled || isAdvisor) ? (
                                                                <a
                                                                    href={resource.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                                >
                                                                    {isAdvisor ? 'Preview' : 'Access'}
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">🔒 Locked</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No modules available for this course yet.</p>
                    </div>
                )}
            </section>

            {/* Video Modal */}
            {currentVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{currentVideo.title}</h3>
                            <button
                                onClick={closeVideoModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="aspect-video">
                            {currentVideo.url.includes('youtube.com') || currentVideo.url.includes('youtu.be') ? (
                                <iframe
                                    src={currentVideo.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    title={currentVideo.title}
                                    className="w-full h-full rounded-lg"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={currentVideo.url}
                                    controls
                                    className="w-full h-full rounded-lg"
                                    autoPlay
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModulesSection;