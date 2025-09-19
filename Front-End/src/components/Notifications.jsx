import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const navigate = useNavigate();
    const notificationsRef = useRef(null);

    // Demo notifications based on your notification model
    const [notifications, setNotifications] = useState([
        {
            _id: '1',
            receiver: 'user1',
            sender: { name: 'Sarah Johnson', avatar: 'SJ' },
            type: 'new_course',
            course: { title: 'Advanced React Patterns', _id: 'course1' },
            message: 'published a new course',
            isRead: false,
            createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        {
            _id: '2',
            receiver: 'user1',
            sender: { name: 'Mike Chen', avatar: 'MC' },
            type: 'new_message',
            message: 'sent you a message about JavaScript fundamentals',
            isRead: false,
            createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
        },
        {
            _id: '3',
            receiver: 'user1',
            sender: { name: 'Emma Davis', avatar: 'ED' },
            type: 'new_course',
            course: { title: 'UI/UX Design Masterclass', _id: 'course2' },
            message: 'published a new course',
            isRead: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            _id: '4',
            receiver: 'user1',
            sender: { name: 'Alex Rodriguez', avatar: 'AR' },
            type: 'new_message',
            message: 'replied to your question in Python course',
            isRead: true,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
            _id: '5',
            receiver: 'user1',
            sender: { name: 'Lisa Wang', avatar: 'LW' },
            type: 'new_course',
            course: { title: 'Data Science with Python', _id: 'course3' },
            message: 'published a new course',
            isRead: true,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
            _id: '6',
            receiver: 'user1',
            sender: { name: 'David Kim', avatar: 'DK' },
            type: 'new_message',
            message: 'mentioned you in a course discussion',
            isRead: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            _id: '7',
            receiver: 'user1',
            sender: { name: 'Rachel Green', avatar: 'RG' },
            type: 'new_course',
            course: { title: 'Digital Marketing Strategy', _id: 'course4' },
            message: 'published a new course',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
    ]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
                setShowAllNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getUnreadCount = () => {
        return notifications.filter(notification => !notification.isRead).length;
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diffInMs = now - new Date(date);
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return `${diffInDays}d ago`;
        }
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification._id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 5);

    return (
        <div className="relative" ref={notificationsRef}>
            <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                        {getUnreadCount()}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-fade-in max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-cyan-50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Notifications
                            </h3>
                            {getUnreadCount() > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        {getUnreadCount() > 0 && (
                            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                You have {getUnreadCount()} unread notification{getUnreadCount() !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {displayedNotifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            displayedNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${!notification.isRead ? 'bg-gradient-to-r from-indigo-25 to-cyan-25 border-l-4 border-l-indigo-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
                                            {notification.sender?.avatar || 'SX'}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {notification.sender?.name || 'SkillExchange'}
                                                </p>
                                                <span className="text-xs text-gray-500 flex-shrink-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {getTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>

                                            {notification.type === 'new_course' && notification.course ? (
                                                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {notification.message} <span className="font-medium text-indigo-600">"{notification.course.title}"</span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {notification.message}
                                                </p>
                                            )}

                                            {/* Type Icon */}
                                            <div className="flex items-center mt-2">
                                                {notification.type === 'new_course' ? (
                                                    <div className="flex items-center text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        New Course
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                                                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        Message
                                                    </div>
                                                )}

                                                {!notification.isRead && (
                                                    <div className="ml-auto">
                                                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Show More/Less Button */}
                    {notifications.length > 5 && (
                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowAllNotifications(!showAllNotifications)}
                                className="w-full py-2 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                {showAllNotifications ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        <span>Show Less</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        <span>Show More ({notifications.length - 5} more)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-cyan-50">
                            <button
                                onClick={() => {
                                    setIsNotificationsOpen(false);
                                    navigate('/notifications');
                                }}
                                className="w-full py-2 px-4 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
