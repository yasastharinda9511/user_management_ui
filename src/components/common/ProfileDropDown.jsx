import {LogOut} from "lucide-react";
import React from "react";


const ProfileDropdown = ({user, handleLogoutClick, setShowProfileDropdown})=>{

    const getAvatarNameFromUsername = (user) =>{
        return user.first_name[0] + user.last_name[0];
    }

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{getAvatarNameFromUsername(user)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Sign Out Button */}
            <button
                onClick={() => {
                    setShowProfileDropdown(false);
                    handleLogoutClick();
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
            </button>
        </div>
    );
}


export default ProfileDropdown;