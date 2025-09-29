const course = require('../models/course.model');
const User = require('../models/users.model');
const { create } = require('../models/notification.model');
const courseService = require('../services/course.service');
const notificationService = require('../services/notification.service');
const coures_creator = require("../models/coures_creator.model");
const UserEnroll = require('../models/User_enroll.model');
exports.createCourse = async (req, res) => {
    try {
        const advisor = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const {
            title,description,fullDescription,category,level,priceInPoints,duration,language,thumbnail,trailerVideo,skills,learningObjectives,prerequisites,courseHighlights,tools,targetAudience,certificate,modules
        } = req.body;

        // Validate required fields
        if (!title || !description || !fullDescription || !category || !level || !priceInPoints || !duration || !thumbnail) {
            return res.status(400).json({
                message: "Required fields: title, description, fullDescription, category, level, priceInPoints, duration, thumbnail"
            });
        }
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: "At least one skill is required" });
        }
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
            trailerVideo: trailerVideo || '',
            skills: skills.filter(skill => skill.trim()),
            learningObjectives: learningObjectives ? learningObjectives.filter(obj => obj.trim()) : [],
            prerequisites: prerequisites ? prerequisites.filter(req => req.trim()) : [],
            courseHighlights: courseHighlights ? courseHighlights.filter(highlight => highlight.trim()) : [],
            tools: tools || [],
            targetAudience: targetAudience ? targetAudience.filter(audience => audience.trim()) : [],
            certificate: certificate !== undefined ? certificate : true,
            advisor: advisor._id
        };
        const savedCourse = await courseService.createCourse(courseData, modules);
        if (!savedCourse) {
            return res.status(400).json({ message: "Failed to create course" });
        }
        const cc = await courseService.createCC({ courseId: savedCourse?._id, advisorId: advisor?._id })
        if (!cc) {
            return res.status(400).json({ message: "Failed to create course creator" });
        }
        const advisorWithFollowers = await User.findById(advisor._id).populate('followers');
        const io = req.app.get('io'); 
        const followerNotifications = [];
        if (advisorWithFollowers.followers && advisorWithFollowers.followers.length > 0) {
            const followerIds = advisorWithFollowers.followers.map(follower => follower._id);
            
            const notifications = await notificationService.emitToMultipleUsers(
                followerIds,
                {
                    senderId: advisor._id,
                    type: 'new_course',
                    courseId: savedCourse._id,
                    message: `published a new course: ${savedCourse.title}`
                },
                io
            );
            followerNotifications.push(...notifications);
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

exports.updateCourse = async (req, res) => {
    try {
        const advisor = req.user;
        const { courseId } = req.params;
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
            trailerVideo,
            skills,
            learningObjectives,
            prerequisites,
            courseHighlights,
            tools,
            targetAudience,
            certificate,
            modules
        } = req.body;

        if (!title || !description || !fullDescription || !category || !level || !priceInPoints || !duration || !thumbnail) {
            return res.status(400).json({
                message: "Required fields: title, description, fullDescription, category, level, priceInPoints, duration, thumbnail"
            });
        }

        // Validate arrays
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: "At least one skill is required" });
        }

        // Check if course exists and user is the advisor
        const existingCourse = await courseService.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }



        // Handle advisor comparison - advisor can be ObjectId or populated object
        let courseAdvisorId;
        if (existingCourse.advisor && existingCourse.advisor._id) {
            // If advisor is populated object
            courseAdvisorId = existingCourse.advisor._id.toString();
        } else {
            // If advisor is ObjectId
            courseAdvisorId = existingCourse.advisor.toString();
        }

        const currentUserId = advisor._id.toString();


        if (courseAdvisorId !== currentUserId) {
            return res.status(403).json({
                message: "You can only edit your own courses",
                debug: {
                    courseAdvisorId,
                    currentUserId,
                    match: courseAdvisorId === currentUserId
                }
            });
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
            trailerVideo: trailerVideo || '',
            skills: skills.filter(skill => skill.trim()),
            learningObjectives: learningObjectives ? learningObjectives.filter(obj => obj.trim()) : [],
            prerequisites: prerequisites ? prerequisites.filter(req => req.trim()) : [],
            courseHighlights: courseHighlights ? courseHighlights.filter(highlight => highlight.trim()) : [],
            tools: tools || [],
            targetAudience: targetAudience ? targetAudience.filter(audience => audience.trim()) : [],
            certificate: certificate !== undefined ? certificate : true
        };

        const updatedCourse = await courseService.updateCourse(courseId, courseData, modules);

        if (!updatedCourse) {
            return res.status(400).json({ message: "Failed to update course" });
        }

        res.status(200).json({
            course: updatedCourse,
            message: "Course updated successfully"
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
        const io = req.app.get('io'); // Get Socket.io instance
        
        const notification = await notificationService.createAndEmitNotification({
            receiverId: course.advisor._id,
            senderId: student._id,
            type: 'question',
            courseId,
            message: `New question posted: ${question}`
        }, io);
        
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

        const io = req.app.get('io'); // Get Socket.io instance
        const notification = await notificationService.createAndEmitNotification({
            receiverId: updatedQuestion.studentId,
            senderId: advisor._id,
            type: 'answer',
            courseId: updatedQuestion.courseId,
            message: `Your question has been answered: ${answer}`
        }, io);
        
        if (!notification) {
            return res.status(400).json({ message: "Failed to create notification" });
        }

        res.status(201).json({ question: updatedQuestion, message: "Answer posted successfully" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get detailed course information for course details page (updated for unified model)
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const course = await courseService.getCourseDetailsForDisplay(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const ModuleModel = require('../models/module.model');
        const modules = await ModuleModel.find({ courseId: courseId }).sort({ order: 1 });
        const data = await coures_creator.find({ advisorId: course.advisor._id }).populate("advisorId courses");

        if (!data || data.length === 0) {
            return {
                _id: user._id,
                fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
                email: user.email,
                courses: "0",
                avgRating: "0.000",
                students: "0",

            }
        }
        let avgRating = 0;
        let coursesWithRatings = 0; 
        for (course1 of data[0].courses) {
            const enrollments = await UserEnroll.find({ courses: course1._id });
            if (course1.averageRating > 0) {
                avgRating += course1.averageRating;
                coursesWithRatings++;
            }
        } 
        avgRating = coursesWithRatings > 0 ? avgRating / coursesWithRatings : 0;
        const response = {
            course: {
                id: course._id,
                title: course.title,
                description: course.description,
                fullDescription: course.fullDescription,
                trailerVideo: course.trailerVideo || '',
                skills: course.skills || [],
                duration: course.duration,
                pricePoints: course.priceInPoints,
                thumbnail: course.thumbnail,
                level: course.level,
                certificate: course.certificate,
                language: course.language || 'English',
                category: course.category,
                students: course.enrollmentCount || 0,
                modules: modules.length,
                lastUpdated: course.updatedAt || course.createdAt,
                rating: course.averageRating ? course.averageRating.toFixed(3) : "0.000",
                totalReviews: course.totalRatings || 0
            },
            advisor: {
                _id: course.advisor._id,
                name: course.advisor.fullname ?
                    `${course.advisor.fullname.firstname} ${course.advisor.fullname.lastname}` :
                    course.advisor.username || 'Unknown Advisor',
                avatar: course.advisor.profilePhoto || course.advisor.profilePicture || 'https://i.pravatar.cc/120?img=47',
                bio: course.advisor.bio || 'Experienced instructor',
                experience: course.advisor.experience || '5+ years experience',
                rating: avgRating ? parseFloat(avgRating.toFixed(3)) : 0.000
            },
            modules: modules.map(module => ({
                id: module._id,
                title: module.title,
                description: module.description,
                duration: module.duration,
                order: module.order,
                videoUrl: module.videoUrl,
                resources: module.resources || []
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add review to course using unified model

exports.addReviewToCourse = async (req, res) => {
    try {
        const student = req.user;
        const { courseId } = req.params;
        const { rating, review } = req.body;

        if (!courseId || !rating || !review) {
            return res.status(400).json({ message: "Course ID, rating, and review are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const updatedCourse = await courseService.rateCourse({ courseId, studentId: student._id.toString(), rating, review });
        console.log({ courseContoller: updatedCourse })
        res.status(201).json({
            message: "Review added successfully",
            averageRating: updatedCourse.averageRating,
            totalReviews: updatedCourse.totalRatings
        });
    } catch (error) {
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

        res.status(200).json({
            reviews: reviews || [],
            count: reviews ? reviews.length : 0
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Q&A for a course
exports.getCourseQA = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const questions = await courseService.getCourseQA(courseId);
        res.status(200).json({
            questions: questions || [],
            count: questions ? questions.length : 0
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};