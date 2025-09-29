const courseModel = require('../models/course.model');
const userModel = require('../models/users.model');
const UserCourses = require('../models/coures_creator.model');

// Search courses with filters
exports.searchCourses = async (searchParams, currentUser) => {
    try {
        const {
            query,
            dateRange,
            minViews,
            minRating,
            author,
            page,
            limit,
            sortBy,
            sortOrder
        } = searchParams;

        // Build query object
        let courseQuery = { status: { $ne: "blocked" } };

        // Text search
        if (query) {
            courseQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { fullDescription: { $regex: query, $options: 'i' } },
                { skills: { $in: [new RegExp(query, 'i')] } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }

        // Date range filter
        if (dateRange && dateRange !== 'all') {
            const now = new Date();
            let startDate;

            switch (dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
            }

            if (startDate) {
                courseQuery.createdAt = { $gte: startDate };
            }
        }

        // Minimum views filter
        if (minViews) {
            courseQuery.views = { $gte: minViews };
        }

        // Minimum rating filter
        if (minRating) {
            courseQuery.averageRating = { $gte: minRating };
        }

        // Author filter
        if (author) {
            // First find users matching the author name
            const authorUsers = await userModel.find({
                $or: [
                    { 'fullname.firstname': { $regex: author, $options: 'i' } },
                    { 'fullname.lastname': { $regex: author, $options: 'i' } },
                    { username: { $regex: author, $options: 'i' } }
                ]
            }).select('_id');

            const authorIds = authorUsers.map(user => user._id);
            courseQuery.advisor = { $in: authorIds };
        }

        // Exclude user's own courses if logged in
        if (currentUser && currentUser._id) {
            const userCourses = await UserCourses.findOne({ advisorId: currentUser._id });
            if (userCourses && userCourses.courses.length > 0) {
                courseQuery._id = { $nin: userCourses.courses };
            }
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const courses = await courseModel.find(courseQuery)
            .populate('advisor', 'fullname username profilePhoto profilePicture bio experience followers email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalItems = await courseModel.countDocuments(courseQuery);
        const totalPages = Math.ceil(totalItems / limit);

        // Format courses for response
        const formattedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            priceInPoints: course.priceInPoints,
            category: course.category,
            level: course.level,
            thumbnail: course.thumbnail,
            averageRating: course.averageRating,
            totalRatings: course.totalRatings,
            views: course.views,
            enrollmentCount: course.enrollmentCount,
            createdAt: course.createdAt,
            skills: course.skills,
            advisor: {
                _id: course.advisor?._id,
                fullname: course.advisor?.fullname ?
                    `${course.advisor.fullname.firstname} ${course.advisor.fullname.lastname}` :
                    course.advisor?.username || 'Unknown',
                username: course.advisor?.username,
                profilePhoto: course.advisor?.profilePhoto || course.advisor?.profilePicture
            }
        }));

        return {
            courses: formattedCourses,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (error) {
        throw new Error(`Failed to search courses: ${error.message}`);
    }
};

// Search users with filters
exports.searchUsers = async (searchParams, currentUser) => {
    try {
        const {
            query,
            userType,
            author,
            page,
            limit,
            sortBy,
            sortOrder
        } = searchParams;

        // Build query object
        let userQuery = {};

        // Text search
        if (query) {
            userQuery.$or = [
                { 'fullname.firstname': { $regex: query, $options: 'i' } },
                { 'fullname.lastname': { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ];
        }

        // User type filter
        if (userType) {
            // This would need to be implemented based on your user model structure
            // For now, we'll use a simple approach
            switch (userType) {
                case 'instructor':
                    // Find users who have created courses
                    const instructorIds = await UserCourses.distinct('advisorId');
                    userQuery._id = { $in: instructorIds };
                    break;
                case 'student':
                    // Find users who have enrolled in courses
                    const UserEnroll = require('../models/User_enroll.model');
                    const studentIds = await UserEnroll.distinct('user');
                    userQuery._id = { $in: studentIds };
                    break;
                case 'expert':
                    // This would need to be defined based on your business logic
                    userQuery.experience = { $gte: 5 }; // Example: 5+ years experience
                    break;
            }
        }

        // Author filter (same as query for users)
        if (author && !query) {
            userQuery.$or = [
                { 'fullname.firstname': { $regex: author, $options: 'i' } },
                { 'fullname.lastname': { $regex: author, $options: 'i' } },
                { username: { $regex: author, $options: 'i' } }
            ];
        }

        // Exclude current user
        if (currentUser && currentUser._id) {
            userQuery._id = { $ne: currentUser._id };
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const users = await userModel.find(userQuery)
            .select('fullname username email bio profilePhoto profilePicture experience followers points createdAt')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalItems = await userModel.countDocuments(userQuery);
        const totalPages = Math.ceil(totalItems / limit);

        // Format users for response
        const formattedUsers = users.map(user => ({
            _id: user._id,
            fullname: user.fullname ?
                `${user.fullname.firstname} ${user.fullname.lastname}` :
                user.username || 'Unknown User',
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePhoto: user.profilePhoto || user.profilePicture,
            experience: user.experience,
            followers: user.followers?.length || 0,
            points: user.points,
            createdAt: user.createdAt
        }));

        return {
            users: formattedUsers,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (error) {
        throw new Error(`Failed to search users: ${error.message}`);
    }
};

// Search all (courses + users)
exports.searchAll = async (searchParams, currentUser) => {
    try {
        const { query, page, limit } = searchParams;

        // Search courses
        const courseResults = await this.searchCourses({
            ...searchParams,
            page: 1,
            limit: Math.ceil(limit / 2)
        }, currentUser);

        // Search users
        const userResults = await this.searchUsers({
            ...searchParams,
            page: 1,
            limit: Math.floor(limit / 2)
        }, currentUser);

        return {
            courses: courseResults.courses,
            users: userResults.users,
            pagination: {
                currentPage: page,
                totalPages: Math.max(courseResults.pagination.totalPages, userResults.pagination.totalPages),
                totalItems: courseResults.pagination.totalItems + userResults.pagination.totalItems,
                hasNext: page < Math.max(courseResults.pagination.totalPages, userResults.pagination.totalPages),
                hasPrev: page > 1
            }
        };
    } catch (error) {
        throw new Error(`Failed to search all: ${error.message}`);
    }
};

// Advanced search with complex filters
exports.advancedSearch = async (searchParams, currentUser) => {
    try {
        const { query, searchScope, filters, page, limit, sortBy, sortOrder } = searchParams;

        let results;

        switch (searchScope) {
            case 'courses':
                results = await this.searchCourses({
                    query,
                    ...filters,
                    page,
                    limit,
                    sortBy,
                    sortOrder
                }, currentUser);
                return {
                    data: { courses: results.courses },
                    pagination: results.pagination
                };

            case 'users':
                results = await this.searchUsers({
                    query,
                    ...filters,
                    page,
                    limit,
                    sortBy,
                    sortOrder
                }, currentUser);
                return {
                    data: { users: results.users },
                    pagination: results.pagination
                };

            case 'all':
            default:
                results = await this.searchAll({
                    query,
                    page,
                    limit
                }, currentUser);
                return {
                    data: results,
                    pagination: results.pagination
                };
        }
    } catch (error) {
        throw new Error(`Failed to perform advanced search: ${error.message}`);
    }
};

// Get search suggestions
exports.getSearchSuggestions = async (query, type = 'all') => {
    try {
        const suggestions = [];

        if (type === 'all' || type === 'courses') {
            // Get course suggestions
            const courseSuggestions = await courseModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { skills: { $in: [new RegExp(query, 'i')] } },
                    { category: { $regex: query, $options: 'i' } }
                ],
                status: { $ne: "blocked" }
            })
                .select('title skills category')
                .limit(5);

            courseSuggestions.forEach(course => {
                suggestions.push({
                    type: 'course',
                    text: course.title,
                    category: course.category
                });

                // Add skills as suggestions
                course.skills.forEach(skill => {
                    if (skill.toLowerCase().includes(query.toLowerCase())) {
                        suggestions.push({
                            type: 'skill',
                            text: skill,
                            category: 'Skill'
                        });
                    }
                });
            });
        }

        if (type === 'all' || type === 'users') {
            // Get user suggestions
            const userSuggestions = await userModel.find({
                $or: [
                    { 'fullname.firstname': { $regex: query, $options: 'i' } },
                    { 'fullname.lastname': { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } }
                ]
            })
                .select('fullname username')
                .limit(5);

            userSuggestions.forEach(user => {
                suggestions.push({
                    type: 'user',
                    text: user.fullname ?
                        `${user.fullname.firstname} ${user.fullname.lastname}` :
                        user.username,
                    category: 'User'
                });
            });
        }

        // Remove duplicates and limit results
        const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
            index === self.findIndex(s => s.text === suggestion.text)
        ).slice(0, 10);

        return uniqueSuggestions;
    } catch (error) {
        throw new Error(`Failed to get search suggestions: ${error.message}`);
    }
};

// Get popular searches (mock implementation - you might want to implement this with actual analytics)
exports.getPopularSearches = async (limit = 10) => {
    try {
        // This is a mock implementation
        // In a real application, you would track search queries and return the most popular ones
        const popularSearches = [
            { query: 'javascript', count: 150 },
            { query: 'react', count: 120 },
            { query: 'python', count: 100 },
            { query: 'web development', count: 90 },
            { query: 'data science', count: 80 },
            { query: 'machine learning', count: 70 },
            { query: 'node.js', count: 60 },
            { query: 'vue.js', count: 50 },
            { query: 'angular', count: 40 },
            { query: 'mongodb', count: 30 }
        ];

        return popularSearches.slice(0, limit);
    } catch (error) {
        throw new Error(`Failed to get popular searches: ${error.message}`);
    }
};
