import React from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import UserCard from "../components/UserCard";

const Home = () => {
    const [showUserCard, setShowUserCard] = React.useState(true);

    // Demo users data
    const demoUsers = [
        {
            name: "John Doe",
            profileImage: "https://imgs.search.brave.com/lZmMKZEl6CSBJtY5BTjFjzJNormpLrdha10_2sVQv34/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vRUFGS2VV/NFpreGcvMS8wLzE2/MDB3L2NhbnZhLWJs/YWNrLW1pbmltYWxp/c3QtcGhvdG8teW91/dHViZS1wcm9maWxl/LXBpY3R1cmUtNjdY/VURMWWpYRTguanBn",
            totalCourses: 12,
            averageRating: 4.8,
            followers: 1248,
            expertise: "React Developer"
        },
        {
            name: "Jane Smith",
            profileImage: "https://imgs.search.brave.com/7UA4zJA5gzNFzYo2yhgIDt8dFdvW50mnYEgKiVWdW40/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtY3NlLmNhbnZh/LmNvbS9ibG9iLzIx/MjA5NTEvMTYwMHct/ZXhLOWRNTDlzQUku/anBn",
            totalCourses: 8,
            averageRating: 4.9,
            followers: 892,
            expertise: "UI/UX Designer"
        },
        {
            name: "Mike Johnson",
            profileImage: "https://imgs.search.brave.com/6Mr0QG-IcUt2jsGTPY0VKWo6RIfaOy6LFKDew2X3K0w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtY3NlLmNhbnZh/LmNvbS9ibG9iLzIx/MjA5NTgvMTYwMHct/el9yX0tDMVdsbVUu/anBn",
            totalCourses: 15,
            averageRating: 4.7,
            followers: 2134,
            expertise: "Marketing Expert"
        },

    ];

    const demoCourses = [
        {
            _id: "1",
            title: "React Complete Course",
            description: "Learn React from scratch with hands-on projects and real-world examples. Build modern web applications with confidence.",
            advisor: { name: "John Doe" },
            priceInPoints: 25,
            categories: ["Programming"],
            tags: ["React", "JavaScript", "Frontend"],
            thumbnail: "https://imgs.search.brave.com/8bcCr5b9LgNITYlkk9hFrd3nXlgYtUEWsD13PoHOoT4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/YW1iaWVudC1pdC5u/ZXQvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMDMvUmVhY3Qt/SW1hZ2UucG5n",
            averageRating: 4.5,
            totalRatings: 123,
            status: "on_going",
            views: 1200,
            createdAt: "2024-01-15T10:00:00Z"
        },
        {
            _id: "2",
            title: "UI/UX Design Fundamentals",
            description: "Master the principles of user interface and user experience design. Create beautiful and functional designs.",
            advisor: { name: "Jane Smith" },
            priceInPoints: 20,
            categories: ["Design"],
            tags: ["UI", "UX", "Figma", "Design"],
            thumbnail: "https://imgs.search.brave.com/e8-89nRZIndUPRXNYarbs1_WRyZ9PZikB7EEbSbmJyE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wdWJs/aWMtaW1hZ2VzLmlu/dGVyYWN0aW9uLWRl/c2lnbi5vcmcvbGl0/ZXJhdHVyZS9hcnRp/Y2xlcy9tYXRlcmlh/bHMvamdDRDJZeTBU/a3FOUExkd3VZYkFK/YmVuT1hnaWZBREph/bmtMWmp0Ny53ZWJw",
            averageRating: 4.8,
            totalRatings: 89,
            status: "complete",
            views: 890,
            createdAt: "2024-01-10T14:30:00Z"
        },
        {
            _id: "3",
            title: "Digital Marketing Strategy",
            description: "Learn effective digital marketing strategies to grow your business online and reach your target audience.",
            advisor: { name: "Mike Johnson" },
            priceInPoints: 30,
            categories: ["Marketing"],
            tags: ["SEO", "Social Media", "Analytics"],
            thumbnail: "https://imgs.search.brave.com/8aALUBtO6my80VDcAKZz7VDeDo7mRDJv4gCp9-mgqr8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9tYXJrZXRpbmct/d29yZC1wbmctZGln/aXRhbC1yZW1peC10/cmFuc3BhcmVudC1i/YWNrZ3JvdW5kXzUz/ODc2LTEwNDIxMzIu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MA",
            averageRating: 4.2,
            totalRatings: 67,
            status: "coming_soon",
            views: 456,
            createdAt: "2024-01-20T09:15:00Z"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {showUserCard && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Featured Instructors
                            </h1>
                            <button
                                onClick={() => setShowUserCard(false)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                            >
                                View All →
                            </button>
                        </div>
                        <div className="space-y-4">
                            {demoUsers.map((user, index) => (
                                <UserCard key={index} user={user} />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Featured Courses
                        </h1>
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                            View All →
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {demoCourses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
