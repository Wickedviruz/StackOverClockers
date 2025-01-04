import React, { useState, useContext, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../services/api';
import { AuthContext } from '../../AuthContext';

const SettingsContent: React.FC = () => {
  const { user } = useContext(AuthContext)!;

  const [activeSubOption, setActiveSubOption] = useState('Edit Profile'); // Default sub-option

  // State för profilfälten
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [githubLink, setGithubLink] = useState('');

  // Hämta användarprofilen från API när komponenten laddas
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.username) return;

      try {
        const profile = await getUserProfile(user.username);
        setDisplayName(profile.displayName || '');
        setLocation(profile.location || '');
        setTitle(profile.title || '');
        setAboutMe(profile.aboutMe || '');
        setWebsiteLink(profile.website || '');
        setTwitterLink(profile.twitter || '');
        setGithubLink(profile.github || '');
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.username) {
      alert('Could not find username. Please log in again.');
      return;
    }

    try {
      await updateUserProfile(user.username, {
        displayName,
        location,
        title,
        aboutMe,
        websiteLink,
        twitterLink,
        githubLink,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const renderSubContent = () => {
    switch (activeSubOption) {
      case 'Edit Profile':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Your title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">About Me</label>
                <textarea
                  placeholder="Write about yourself"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="text"
                  placeholder="Your website link"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <input
                  type="text"
                  placeholder="Your Twitter link or username"
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <input
                  type="text"
                  placeholder="Your GitHub link or username"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 text-white font-medium rounded bg-[#D26000] dark:bg-[#D26000] hover:bg[#ff7505] focus:outline-none focus:ring-2 focus:ring-[#ff7505] dark:focus:ring-[#ff7505] dark:hover:bg-[#ff7505]"
              >
                Save
              </button>
            </form>
          </div>
        );
        case 'Delete Profile':
            return (
              <div>
                <h3 className="text-xl font-bold mb-4">Delete Profile</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Before confirming that you would like your profile deleted, we'd like to explain the
                  implications of deletion:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
                  <li>Deletion is irreversible, and you cannot regain your original content.</li>
                  <li>Your questions and answers will remain on the site but will be anonymized.</li>
                  <li>
                    Deletion only applies to this site; other connected accounts will not be affected.
                  </li>
                </ul>
                <div className="flex items-center mb-4">
                  <input type="checkbox" className="mr-2" id="delete-confirm" />
                  <label htmlFor="delete-confirm" className="text-gray-600 dark:text-gray-400">
                    I have read and understand the implications of deleting my profile.
                  </label>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded">Delete Profile</button>
              </div>
            );
          case 'Preferences':
            return (
              <div>
                <h3 className="text-xl font-bold mb-4">Preferences</h3>
                <p>Update your site preferences here.</p>
              </div>
            );
          case 'Authorized Applications':
            return (
              <div>
                <h3 className="text-xl font-bold mb-4">Authorized Applications</h3>
                <p>Manage your API tokens and third-party application access here.</p>
              </div>
            );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white dark:bg-[#1C1C1C] p-4 rounded-l">
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-bold mb-2 text-black dark:text-white">
              Personal Information
            </h4>
            <ul className="space-y-2 pl-4">
              <li>
                <button
                  onClick={() => setActiveSubOption('Edit Profile')}
                  className={`w-full text-left px-1 py-1 rounded ${
                    activeSubOption === 'Edit Profile'
                      ? 'bg-[#D26000] dark:bg-[#D26000] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-[#ff7505] dark:hover:bg-[#ff7505]'
                  }`}
                >
                  Edit Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSubOption('Delete Profile')}
                  className={`w-full text-left px-1 py-1 rounded ${
                    activeSubOption === 'Delete Profile'
                      ? 'bg-[#D26000] dark:bg-[#D26000] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-[#ff7505] dark:hover:bg-[#ff7505]'
                  }`}
                >
                  Delete Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Site Settings */}
          <div>
            <h4 className="text-sm font-bold mb-2 text-black dark:text-white">
              Site Settings
            </h4>
            <ul className="space-y-2 pl-4">
              <li>
                <button
                  onClick={() => setActiveSubOption('Preferences')}
                  className={`w-full text-left px-1 py-1 rounded ${
                    activeSubOption === 'Preferences'
                      ? 'bg-[#D26000] dark:bg-[#D26000] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-[#ff7505] dark:hover:bg-[#ff7505]'
                  }`}
                >
                  Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* API */}
          <div>
            <h4 className="text-sm font-bold mb-2 text-black dark:text-white">API</h4>
            <ul className="space-y-2 pl-4">
              <li>
                <button
                  onClick={() => setActiveSubOption('Authorized Applications')}
                  className={`w-full text-left px-1 py-1 rounded ${
                    activeSubOption === 'Authorized Applications'
                      ? 'bg-[#D26000] dark:bg-[#D26000] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-[#ff7505] dark:hover:bg-[#ff7505]'
                  }`}
                >
                  Authorized Applications
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-3/4 bg-white dark:bg-[#1C1C1C] p-6 rounded-r">{renderSubContent()}</div>
    </div>
  );
};

export default SettingsContent;
