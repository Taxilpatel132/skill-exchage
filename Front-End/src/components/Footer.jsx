export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-indigo-600 to-cyan-400 text-gray-100">
            {/* Top CTA */}
            <div className="text-center py-6">
                <h2 className="text-lg font-semibold">🚀 Learn. Share. Grow. Together.</h2>
                <button className="mt-3 px-5 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-200">
                    Join Now
                </button>
            </div>

            {/* Main Links */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center py-6 px-6 gap-6">
                {/* Quick Links */}
                <ul className="flex gap-6 text-sm font-medium">
                    <li className="hover:underline cursor-pointer">Browse Courses</li>
                    <li className="hover:underline cursor-pointer">Student Dashboard</li>
                    <li className="hover:underline cursor-pointer">Become an Advisor</li>
                </ul>

                {/* Social */}
                <div className="flex gap-4 text-xl">
                    <span>📘</span>
                    <span>📸</span>
                    <span>💼</span>
                </div>
            </div>

            {/* Bottom */}
            <div className="text-center py-3 border-t border-gray-300/20 text-sm">
                © 2025 Skill Exchange. All rights reserved.
            </div>
        </footer>
    );
}
