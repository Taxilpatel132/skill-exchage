const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const authMiddleware = require('../auth-middleware/auth');

// Search endpoints with optional authentication
router.get('/courses', authMiddleware.optionalAuthUser, searchController.searchCourses);
router.get('/users', authMiddleware.optionalAuthUser, searchController.searchUsers);
router.get('/all', authMiddleware.optionalAuthUser, searchController.searchAll);

// Advanced search with filters
router.post('/advanced', authMiddleware.optionalAuthUser, searchController.advancedSearch);

// Get search suggestions
router.get('/suggestions', authMiddleware.optionalAuthUser, searchController.getSearchSuggestions);

// Get popular searches
router.get('/popular', authMiddleware.optionalAuthUser, searchController.getPopularSearches);

module.exports = router;
