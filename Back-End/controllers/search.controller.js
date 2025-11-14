const searchService = require('../services/search.service');

// Search courses with filters
exports.searchCourses = async (req, res) => {
    try {
        const {
            query,
            dateRange = 'all',
            minViews = '',
            minRating = '',
            author = '',
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const searchParams = {
            query: query?.trim(),
            dateRange,
            minViews: minViews ? parseInt(minViews) : null,
            minRating: minRating ? parseFloat(minRating) : null,
            author: author?.trim(),
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder
        };

        const results = await searchService.searchCourses(searchParams, req.user);

        res.status(200).json({
            success: true,
            data: results.courses,
            pagination: {
                currentPage: results.pagination.currentPage,
                totalPages: results.pagination.totalPages,
                totalItems: results.pagination.totalItems,
                hasNext: results.pagination.hasNext,
                hasPrev: results.pagination.hasPrev
            },
            filters: searchParams
        });
    } catch (error) {
        console.error('Search courses error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to search courses'
        });
    }
};

// Search users with filters
exports.searchUsers = async (req, res) => {
    try {
        const {
            query,
            userType = '',
            author = '',
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const searchParams = {
            query: query?.trim(),
            userType: userType?.trim(),
            author: author?.trim(),
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder
        };

        const results = await searchService.searchUsers(searchParams, req.user);
        console.log('Search users results:', results);
        res.status(200).json({
            success: true,
            data: results.users,
            pagination: {
                currentPage: results.pagination.currentPage,
                totalPages: results.pagination.totalPages,
                totalItems: results.pagination.totalItems,
                hasNext: results.pagination.hasNext,
                hasPrev: results.pagination.hasPrev
            },
            filters: searchParams
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to search users'
        });
    }
};

// Search all (courses + users)
exports.searchAll = async (req, res) => {
    try {
        const {
            query,
            page = 1,
            limit = 12
        } = req.query;

        const searchParams = {
            query: query?.trim(),
            page: parseInt(page),
            limit: parseInt(limit)
        };

        const results = await searchService.searchAll(searchParams, req.user);

        res.status(200).json({
            success: true,
            data: {
                courses: results.courses,
                users: results.users
            },
            pagination: {
                currentPage: results.pagination.currentPage,
                totalPages: results.pagination.totalPages,
                totalItems: results.pagination.totalItems,
                hasNext: results.pagination.hasNext,
                hasPrev: results.pagination.hasPrev
            },
            filters: searchParams
        });
    } catch (error) {
        console.error('Search all error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to search'
        });
    }
};

// Advanced search with complex filters
exports.advancedSearch = async (req, res) => {
    try {
        const {
            query,
            searchScope = 'all',
            filters = {},
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.body;

        const searchParams = {
            query: query?.trim(),
            searchScope,
            filters,
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder
        };

        const results = await searchService.advancedSearch(searchParams, req.user);

        res.status(200).json({
            success: true,
            data: results.data,
            pagination: results.pagination,
            filters: searchParams
        });
    } catch (error) {
        console.error('Advanced search error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to perform advanced search'
        });
    }
};

// Get search suggestions
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { query, type = 'all' } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(200).json({
                success: true,
                suggestions: []
            });
        }

        const suggestions = await searchService.getSearchSuggestions(query.trim(), type);

        res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to get suggestions'
        });
    }
};

// Get popular searches
exports.getPopularSearches = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const popularSearches = await searchService.getPopularSearches(parseInt(limit));

        res.status(200).json({
            success: true,
            popularSearches
        });
    } catch (error) {
        console.error('Get popular searches error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to get popular searches'
        });
    }
};
