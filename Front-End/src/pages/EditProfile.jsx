import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

const EditProfile = () => {
    const navigate = useNavigate();
    const myId = localStorage.getItem('myId');
    const isLoggedIn = !!localStorage.getItem('myId');

    const [myData, setMyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstname: '',
        lastname: '',
        bio: '',
        profilePhoto: '',
        phone: ''
    });
    const [previewImage, setPreviewImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchProfileData();
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        async function fetchMyData() {
            if (!isLoggedIn) return;
            try {
                const response = await axios.get('http://localhost:3000/users/mycard', { withCredentials: true });
                setMyData(response.data.usercard);
            } catch (error) {
                console.log('Failed to fetch user data:', error);
            }
        }
        fetchMyData();
    }, [isLoggedIn]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/users/profile/${myId}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                const userData = response.data.yourProfile;
                const nameParts = userData.fullname.split(' ');

                setProfileData({
                    firstname: nameParts[0] || '',
                    lastname: nameParts.slice(1).join(' ') || '',
                    bio: userData.bio || '',
                    profilePhoto: userData.profilePhoto || '',
                    phone: userData.phone || ''
                });
                setPreviewImage(userData.profilePhoto || '');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            alert('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const { value } = e.target;
        setProfileData(prev => ({
            ...prev,
            profilePhoto: value
        }));
        setPreviewImage(value);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        console.log('📤 Starting file upload...', {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type
        });

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('profilePhoto', selectedFile);

            console.log('🔄 Sending request to server...');

            const response = await axios.post('http://localhost:3000/users/profile/upload-photo', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Upload progress: ${percentCompleted}%`);
                }
            });

            console.log('✅ Upload response:', response.data);

            if (response.status === 200) {
                const cloudinaryUrl = response.data.profilePhoto;
                setProfileData(prev => ({
                    ...prev,
                    profilePhoto: cloudinaryUrl
                }));
                setPreviewImage(cloudinaryUrl);
                setSelectedFile(null);

                // Clear the file input
                const fileInput = document.getElementById('file-upload');
                if (fileInput) fileInput.value = '';

                alert('Profile photo uploaded successfully!');
            }
        } catch (error) {
            console.error('❌ Upload error:', error);
            console.error('Error response:', error.response?.data);

            let errorMessage = 'Failed to upload photo';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profileData.firstname.trim() || !profileData.lastname.trim()) {
            alert('First name and last name are required');
            return;
        }

        setSaving(true);
        try {
            const updateData = {
                fullname: {
                    firstname: profileData.firstname.trim(),
                    lastname: profileData.lastname.trim()
                },
                bio: profileData.bio.trim(),
                profilePhoto: profileData.profilePhoto.trim(),
                phone: profileData.phone.trim()
            };

            const response = await axios.put('http://localhost:3000/users/profile/edit', updateData, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert('Profile updated successfully!');
                navigate(`/profile/${myId}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Navbar IsLoggedIn={isLoggedIn} myData={myData} />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold text-white text-center">Edit Profile</h1>
                        <p className="text-xl text-white/90 text-center mt-4">
                            Update your personal information and preferences
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Profile Photo Section */}
                            <div className="text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <img
                                            src={previewImage || 'https://via.placeholder.com/150x150?text=Profile'}
                                            alt="Profile Preview"
                                            className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-indigo-100"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150x150?text=Profile';
                                            }}
                                        />
                                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* File Upload Section */}
                                    <div className="w-full max-w-md space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Upload from Device
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 text-center text-sm font-medium text-gray-700"
                                                >
                                                    Choose File
                                                </label>
                                                {selectedFile && (
                                                    <button
                                                        type="button"
                                                        onClick={handlePhotoUpload}
                                                        disabled={uploading}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${uploading
                                                            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                            }`}
                                                    >
                                                        {uploading ? 'Uploading...' : 'Upload'}
                                                    </button>
                                                )}
                                            </div>
                                            {selectedFile && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Selected: {selectedFile.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-center text-gray-500 text-sm">
                                            OR
                                        </div>

                                        {/* URL Input Section */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Profile Photo URL
                                            </label>
                                            <input
                                                type="url"
                                                name="profilePhoto"
                                                value={profileData.profilePhoto}
                                                onChange={handleImageChange}
                                                placeholder="Enter image URL"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Name Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={profileData.firstname}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={profileData.lastname}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            {/* Phone Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your phone number (10 digits)"
                                />
                            </div>

                            {/* Bio Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                                    placeholder="Tell us about yourself..."
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    {profileData.bio.length}/500 characters
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/profile/${myId}`)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${saving
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 hover:shadow-lg'
                                        }`}
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
