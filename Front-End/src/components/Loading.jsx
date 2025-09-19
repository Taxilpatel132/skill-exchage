import React from 'react';

const Loading = ({
    size = 'medium',
    type = 'spinner',
    text = 'Loading...',
    fullScreen = false,
    className = ''
}) => {
    // Size configurations
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-10 h-10',
        large: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    // Loading spinner component
    const Spinner = () => (
        <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 ${sizeClasses[size]}`}></div>
    );

    // Loading dots component
    const Dots = () => (
        <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );

    // Loading pulse component
    const Pulse = () => (
        <div className={`bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg animate-pulse ${sizeClasses[size]}`}></div>
    );

    // Loading bars component
    const Bars = () => (
        <div className="flex space-x-1">
            <div className="w-2 h-8 bg-indigo-600 rounded animate-pulse"></div>
            <div className="w-2 h-8 bg-cyan-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-8 bg-indigo-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-8 bg-cyan-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
    );

    // Skill exchange themed loader
    const SkillLoader = () => (
        <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg animate-pulse"></div>
            </div>
        </div>
    );

    // Select loading type
    const getLoadingComponent = () => {
        switch (type) {
            case 'dots':
                return <Dots />;
            case 'pulse':
                return <Pulse />;
            case 'bars':
                return <Bars />;
            case 'skill':
                return <SkillLoader />;
            default:
                return <Spinner />;
        }
    };

    // Full screen loading overlay
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <div className="text-center">
                    {getLoadingComponent()}
                    {text && (
                        <p className="mt-4 text-gray-600 font-medium animate-pulse">
                            {text}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Regular loading component
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            {getLoadingComponent()}
            {text && (
                <p className="mt-3 text-gray-600 text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

// Skeleton loading for cards
export const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
    </div>
);

// Skeleton loading for course details
export const SkeletonCourseDetails = () => (
    <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>

        {/* Content skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                {/* Modules skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="space-y-6">
                <div className="h-60 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Skeleton loading for user profile
export const SkeletonUserProfile = () => (
    <div className="animate-pulse">
        <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    </div>
);

// Loading button component
export const LoadingButton = ({
    loading = false,
    children,
    className = '',
    disabled = false,
    ...props
}) => (
    <button
        className={`relative ${className} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
        disabled={loading || disabled}
        {...props}
    >
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
            {children}
        </span>
    </button>
);

export default Loading;