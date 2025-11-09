import { useState } from 'react';
import { useSelector } from "react-redux";

const Profile = () => {
    const { user } = useSelector(state => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
        email: user?.email || ''
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
            email: user?.email || ''
        });
    };

    const handleSave = () => {
        // Here you would typically dispatch an action to update the user
        console.log('Saving user data:', editedUser);
        setIsEditing(false);
        // You can add your update logic here
    };

    const handleInputChange = (field, value) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Generate avatar initials from first_name and last_name
    const getInitials = () => {
        const firstName = user?.first_name || '';
        const lastName = user?.last_name || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U';
    };

    const getFullName = () => {
        const firstName = user?.first_name || '';
        const lastName = user?.last_name || '';
        return `${firstName} ${lastName}`.trim() || user?.username || 'User';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                        <p className="text-gray-600 mt-2">Manage your account information.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                        {/* Header with Avatar and Basic Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-gray-200">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl font-bold text-blue-600">{getInitials()}</span>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-2xl font-bold text-gray-900">{getFullName()}</h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <div className="flex items-center mt-2 space-x-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user?.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${user?.is_email_verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {user?.is_email_verified ? 'Email Verified' : 'Email Not Verified'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={isEditing ? editedUser.first_name : (user?.first_name || '')}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={isEditing ? editedUser.last_name : (user?.last_name || '')}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={user?.username || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={isEditing ? editedUser.email : (user?.email || '')}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={isEditing ? editedUser.phone : (user?.phone || '')}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                                <input
                                    type="text"
                                    value={user?.id || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                                    <input
                                        type="text"
                                        value={formatDate(user?.created_at)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                                    <input
                                        type="text"
                                        value={formatDate(user?.last_login)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;