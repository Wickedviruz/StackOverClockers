import React from 'react';

interface ProfileHeaderProps {
  user: { username: string };
  profile: {
    displayName: string | null;
    title: string | null;
    location: string | null;
    createdAt: string;
    lastSeen: string;
  } | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profile }) => {
  const displayName = profile?.displayName || user.username;

  return (
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div>
        <h2 className="text-2xl font-bold">{displayName}</h2>
        {profile?.title && <p className="text-sm text-gray-600 dark:text-gray-400">{profile.title}</p>}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Member since {new Date(profile?.createdAt || '').toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last seen {profile?.lastSeen}</p>
        {profile?.location && <p className="text-sm text-gray-600 dark:text-gray-400">{profile.location}</p>}
      </div>
    </div>
  );
};

export default ProfileHeader;
