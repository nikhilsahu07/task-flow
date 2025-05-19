import { useState } from 'react';
import axios from 'axios'; // Using axios for consistency, though fetch is fine too

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

function App() {
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username.');
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    setProfile(null);
    try {
      // The server is running on port 5000
      const response = await axios.get<GitHubProfile>(
        `http://localhost:5000/api/github/user/${username.trim()}`,
      );
      setProfile(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Failed to fetch profile. Please check the username.');
      } else {
        setError('An unexpected error occurred.');
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
          GitHub Profile Extractor
        </h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub Username"
            className="flex-grow p-3 border border-gray-700 rounded-l-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-gray-700 text-white placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && fetchGitHubProfile()}
          />
          <button
            onClick={fetchGitHubProfile}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Get Profile'}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md text-center">
            {error}
          </p>
        )}

        {profile && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg shadow-inner text-left animate-fadeIn">
            <div className="flex items-center mb-6">
              <img
                src={profile.avatar_url}
                alt={`${profile.name || profile.login}'s avatar`}
                className="w-24 h-24 rounded-full mr-6 border-4 border-purple-500"
              />
              <div>
                <h2 className="text-2xl font-semibold text-purple-300">
                  {profile.name || profile.login}
                </h2>
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  @{profile.login}
                </a>
              </div>
            </div>
            {profile.bio && <p className="text-gray-300 mb-4">{profile.bio}</p>}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-600 p-3 rounded-md">
                <p className="text-xl font-bold text-purple-400">{profile.public_repos}</p>
                <p className="text-sm text-gray-400">Repositories</p>
              </div>
              <div className="bg-gray-600 p-3 rounded-md">
                <p className="text-xl font-bold text-purple-400">{profile.followers}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="bg-gray-600 p-3 rounded-md">
                <p className="text-xl font-bold text-purple-400">{profile.following}</p>
                <p className="text-sm text-gray-400">Following</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Basic Tailwind animation utility - can be moved to index.css */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

export default App;
