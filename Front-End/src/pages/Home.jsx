import React, { useEffect, useInsertionEffect } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import UserCard from "../components/UserCard";
import axios from "axios";
import { useUser } from "../context/UserContext";
const Home = () => {
    const [showUserCard, setShowUserCard] = React.useState(true);
    const [myData, setMyData] = React.useState(null);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [courses, setCourses] = React.useState([]);
    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('http://localhost:3000/users/mycard', { withCredentials: true });

            setMyData(response.data.usercard);

            setIsLoggedIn(response.data.isLogin);

            localStorage.setItem('myId', response.data?.usercard?._id);

        }
        fetchData();
    }, []);



    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:3000/course/search/all', { withCredentials: true });
                setCourses(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }
        , [])

    return (
        <>
            <Navbar IsLoggedIn={isLoggedIn} myData={myData} />
            <div className="container mx-auto px-4 py-8">


                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Featured Courses
                        </h1>
                        <button

                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                            View All →
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(c => (
                            <CourseCard key={c._id} course={c} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;