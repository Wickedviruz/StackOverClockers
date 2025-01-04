import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { getUserProfile } from '../services/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileContent from '../components/profile/ProfileContent';
import SettingsContent from '../components/profile/SettingsContent';

interface UserProfile {
  displayName: string | null;
  title: string | null;
  location: string | null;
  aboutMe: string | null;
  websiteLink: string | null;
  twitterLink: string | null;
  githubLink: string | null;
  createdAt: string;
  lastSeen: string;
}

const Profile: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const [activeTab, setActiveTab] = useState('Profile'); // Default tab: Profile
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(user?.username!);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
  
    if (user) fetchProfile();
  }, [user]);

  const renderTabContent = () => {
    if (activeTab === 'Profile') {
      return <ProfileContent profile={profile} />;
    } else if (activeTab === 'Settings') {
      return <SettingsContent />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg p-6">
            {/* Profile Header */}
            <ProfileHeader user={user} profile={profile} />

            {/* Tabs */}
            <div className="mt-6 flex space-x-4 border-b border-gray-300 dark:border-[#3B3B3B]">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'Profile'
                    ? 'border-b-2 border-[#D26000] text-[#D26000]'
                    : 'text-gray-500 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('Profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'Settings'
                    ? 'border-b-2 border-[#D26000] text-[#D26000]'
                    : 'text-gray-500 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('Settings')}
              >
                Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>
          </div>
        ) : (
          <p>You must be logged in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
