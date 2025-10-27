import AdminNavbar from "../components/AdminNavbar";


const AdminDashboard = () => {
    return (
        <>
            <AdminNavbar />
            <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-['Inter',sans-serif]">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-[#111827] font-['Poppins',sans-serif]">Admin Dashboard</h1>
                        <p className="mt-2 text-[#111827] opacity-70 font-normal">
                            Welcome to the admin dashboard. Here you can manage users, view reports, and configure settings.
                        </p>
                    </header>

                    {/* Dashboard Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Stats Cards */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#111827] opacity-60 font-medium">Total Users</p>
                                    <p className="text-3xl font-bold text-[#111827] mt-2">1,234</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#111827] opacity-60 font-medium">Total Courses</p>
                                    <p className="text-3xl font-bold text-[#111827] mt-2">567</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#111827] opacity-60 font-medium">Active Sessions</p>
                                    <p className="text-3xl font-bold text-[#111827] mt-2">89</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;