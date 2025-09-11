const course = require('../models/course.model');
const User = require('../models/users.model');
const { create } = require('../models/notification.model');
const courseService = require('../services/course.service');

exports.createCourse = async (req, res) => {
    try {
        const advisor = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const {
            title,
            description,
            fullDescription,
            category,
            level,
            priceInPoints,
            duration,
            language,
            thumbnail,
            skills,
            learningObjectives,
            prerequisites,
            courseHighlights,
            tools,
            targetAudience,
            certificate,
            modules
        } = req.body;

        // Validate required fields
        if (!title || !description || !fullDescription || !category || !level || !priceInPoints || !duration || !thumbnail) {
            return res.status(400).json({
                message: "Required fields: title, description, fullDescription, category, level, priceInPoints, duration, thumbnail"
            });
        }

        // Validate arrays
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: "At least one skill is required" });
        }

        // Prepare course data
        const courseData = {
            title: title.trim(),
            description: description.trim(),
            fullDescription: fullDescription.trim(),
            category,
            level,
            priceInPoints: parseInt(priceInPoints),
            duration: duration.trim(),
            language: language || 'English',
            thumbnail,
            skills: skills.filter(skill => skill.trim()),
            learningObjectives: learningObjectives ? learningObjectives.filter(obj => obj.trim()) : [],
            prerequisites: prerequisites ? prerequisites.filter(req => req.trim()) : [],
            courseHighlights: courseHighlights ? courseHighlights.filter(highlight => highlight.trim()) : [],
            tools: tools || [],
            targetAudience: targetAudience ? targetAudience.filter(audience => audience.trim()) : [],
            certificate: certificate !== undefined ? certificate : true,
            advisor: advisor._id
        };

        console.log("Creating course with data:", courseData);
        const savedCourse = await courseService.createCourse(courseData, modules);

        if (!savedCourse) {
            return res.status(400).json({ message: "Failed to create course" });
        }


        const cc = await courseService.createCC({ courseId: savedCourse?._id, advisorId: advisor?._id })
        if (!cc) {
            return res.status(400).json({ message: "Failed to create course creator" });
        }


        const advisorWithFollowers = await User.findById(advisor._id).populate('followers');


        const followerNotifications = [];
        if (advisorWithFollowers.followers && advisorWithFollowers.followers.length > 0) {
            for (const follower of advisorWithFollowers.followers) {
                const notificationData = {
                    senderId: advisor._id,
                    receiverId: follower._id,
                    courseId: savedCourse._id,
                    message: `published a new course: ${savedCourse.title}`,
                    type: 'new_course'
                };
                const notification = await courseService.createNotification(notificationData);
                if (notification) {
                    followerNotifications.push(notification);
                }
            }
        }

        res.status(201).json({
            course: savedCourse,
            courseCreator: cc,
            message: "Course created successfully",
            notificationsSent: followerNotifications.length
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses(req.user);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.getCourse = async (req, res) => {
    try {
        // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        course.views += 1;
        await course.save();
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


//pending
exports.getCourseByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const courses = await courseService.getCourseByTitle(title);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found with the given title" });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// Removed rateCourse - using addReviewToCourse instead (unified model)
// complete
exports.enrollInCourse = async (req, res) => {
    try {
        const student = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const enrollment = await courseService.enrollInCourse({ courseId, studentId: student._id });
        if (!enrollment) {
            return res.status(400).json({ message: "Failed to enroll in course" });
        }
        res.status(201).json({ enrollment, message: "Enrolled in course successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.askQuestion = async (req, res) => {
    try {
        const student = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;
        const { question } = req.body;

        if (!courseId || !question || !student) {
            return res.status(400).json({ message: "Course ID, question, and student are required" });
        }

        const newQuestion = await courseService.askQuestion({ courseId, studentId: student._id, question });
        if (!newQuestion) {
            return res.status(400).json({ message: "Failed to post question" });
        }

        // Notify the course advisor about the new question
        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found for notification" });
        }
        const receiverId = course.advisor._id; // Assuming the course object has an advisor field with the advisor's ID
        const notificationData = {
            receiverId: receiverId,
            senderId: student._id,
            type: 'question',
            courseId,
            message: `New question posted: ${question}`
        };
        const notification = await courseService.createNotification(notificationData);
        if (!notification) {
            return res.status(400).json({ message: "Failed to create notification" });
        }
        res.status(201).json({ question: newQuestion, message: "Question posted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.answerQuestion = async (req, res) => {
    try {
        const advisor = req.user;
        const { questionId } = req.params;
        const { answer } = req.body;

        if (!questionId || !answer) {
            return res.status(400).json({ message: "Question ID and answer are required" });
        }

        const updatedQuestion = await courseService.answerQuestion({ questionId, instructorId: advisor._id, answer });
        if (!updatedQuestion) {
            return res.status(400).json({ message: "Failed to post answer" });
        }

        // Notify the student who asked the question about the new answer
        const course = await courseService.getCourseById(updatedQuestion.courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found for notification" });
        }

        const receiverId = updatedQuestion.studentId; // The student who asked the question
        const notificationData = {
            receiverId: receiverId,
            senderId: advisor._id,
            type: 'answer',
            courseId: updatedQuestion.courseId,
            message: `Your question has been answered: ${answer}`
        };
        const notification = await courseService.createNotification(notificationData);
        if (!notification) {
            return res.status(400).json({ message: "Failed to create notification" });
        }

        res.status(201).json({ question: updatedQuestion, message: "Answer posted successfully" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get detailed course information for course details page (updated for unified model)
exports.getCourseDetailsUpdated = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Get course with all details using unified model
        const course = await courseService.getCourseDetailsForDisplay(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Format response for CourseDetails page (simplified structure)
        const response = {
            course: {
                id: course._id,
                title: course.title,
                description: course.description,
                skills: course.skills,
                duration: course.duration,
                pricePoints: course.priceInPoints,
                thumbnail: course.thumbnail,
                level: course.level,
                certificate: course.certificate,
                language: course.language,
                category: course.category,
                students: course.enrollmentCount || 0,
                modules: course.totalModules,
                lastUpdated: course.lastUpdated,
                rating: course.averageRating || 0,
                totalReviews: course.totalRatings || 0,
                reviews: course.latestReviews
            },
            advisor: {
                name: course.advisor.username,
                avatar: course.advisor.profilePicture || 'https://i.pravatar.cc/120?img=47',
                bio: course.advisor.bio || 'Experienced instructor',
                experience: course.advisor.experience || '5+ years experience',
                rating: 4.8
            },
            modules: course.getOrderedModules()
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting course details:', error);
        res.status(400).json({ message: error.message });
    }
};

// Add review to course using unified model

exports.addReviewToCourse = async (req, res) => {
    try {
        const student = req.user;
        const { courseId } = req.params;
        const { rating, review } = req.body;
        console.log(courseId, rating, review);
        if (!courseId || !rating || !review) {
            return res.status(400).json({ message: "Course ID, rating, and review are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const updatedCourse = await courseService.rateCourse({ courseId, studentId: student._id.toString(), rating, review });

        res.status(201).json({
            message: "Review added successfully",
            averageRating: updatedCourse.averageRating,
            totalReviews: updatedCourse.totalRatings
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get course reviews using unified model
exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const reviews = await courseService.getCourseReviews(courseId);

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error getting course reviews:', error);
        res.status(400).json({ message: error.message });
    }
};
