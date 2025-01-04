import React from 'react';

interface ProfileContentProps {
  profile: {
    aboutMe: string | null;
    websiteLink: string | null;
    twitterLink: string | null;
    githubLink: string | null;
  } | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  if (!profile) {
    return <p>Loading profile information...</p>;
  }

  return (
    <div>
      {/* About Me */}
      <h3 className="text-xl font-bold mb-4">About Me</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {profile.aboutMe || 'This section is currently blank.'}
      </p>

      {/* Links */}
      <h3 className="text-xl font-bold mb-4">Links</h3>
      <ul className="list-none space-y-2">
        {profile.websiteLink && (
          <li>
            <a
              href={profile.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              Website
            </a>
          </li>
        )}
        {profile.twitterLink && (
          <li>
            <a
              href={`https://twitter.com/${profile.twitterLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              Twitter
            </a>
          </li>
        )}
        {profile.githubLink && (
          <li>
            <a
              href={`https://github.com/${profile.githubLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              GitHub
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProfileContent;
