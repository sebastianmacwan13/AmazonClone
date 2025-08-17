import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ currentUser, setCurrentUser, API_BASE_URL, showGlobalMessage }) => {
  const navigate = useNavigate();

  const [profileUsername, setProfileUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('https://placehold.co/120x120?text=Avatar');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!currentUser) {
      showGlobalMessage("Please log in to view your profile.", "error");
      navigate("/login");
      return;
    }

    setProfileUsername(currentUser.username || '');
    setProfileEmail(currentUser.email || '');

    // ✅ First try to load from backend
    if (currentUser.profileurl) {
      setAvatarPreview(currentUser.profileurl);
    } else {
      // Fallback to localStorage
      const avatarKey = `avatar_${currentUser.id}`;
      const savedAvatar = localStorage.getItem(avatarKey);
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      }
    }
  }, [currentUser, navigate, showGlobalMessage]);


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;
        setAvatarPreview(base64Image);
        localStorage.setItem(`avatar_${currentUser.id}`, base64Image);

        // 🔥 Send image URL to backend to store in DB
        try {
          const res = await fetch(`${API_BASE_URL}/api/user/update-avatar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentUser.id, profileUrl: base64Image }),
          });
          const data = await res.json();
          if (res.ok) {
            showGlobalMessage("Avatar updated successfully!", "success");

            const updatedUser = { ...currentUser, profileurl: base64Image };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setCurrentUser?.(updatedUser);
          } else {
            showGlobalMessage(data.message || "Failed to update avatar.", "error");
          }
        } catch (err) {
          console.error("Avatar update error:", err);
          showGlobalMessage("Network error while updating avatar.", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      showGlobalMessage("Please enter a valid new email address.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update-email`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentUser.id, newEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...currentUser, email: newEmail };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        if (typeof window.setCurrentUserGlobally === 'function') {
          window.setCurrentUserGlobally(updatedUser);
        }
        if (typeof setCurrentUser === 'function') {
          setCurrentUser(updatedUser);
        }

        setProfileEmail(newEmail);
        showGlobalMessage(data.message || "Email updated successfully!", "success");
      } else {
        showGlobalMessage(data.message || "Failed to update email.", "error");
      }
    } catch (err) {
      console.error("Error updating email:", err);
      showGlobalMessage("Network error during email update.", "error");
    }
  };
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername || newUsername.length < 3) {
      showGlobalMessage("Username must be at least 3 characters.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update-username`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentUser.id, newUsername }),
      });
      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...currentUser, username: newUsername };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        if (typeof setCurrentUser === 'function') {
          setCurrentUser(updatedUser);
        }

        setProfileUsername(newUsername);
        showGlobalMessage(data.message || "Username updated successfully!", "success");
      } else {
        showGlobalMessage(data.message || "Failed to update username.", "error");
      }
    } catch (err) {
      console.error("Username update error:", err);
      showGlobalMessage("Network error during username update.", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      showGlobalMessage("Enter your old password and a new password (min 6 characters).", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentUser.id, oldPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        showGlobalMessage(data.message || "Password changed successfully!", "success");
        setOldPassword('');
        setNewPassword('');
      } else {
        showGlobalMessage(data.message || "Failed to change password.", "error");
      }
    } catch (err) {
      console.error("Password update error:", err);
      showGlobalMessage("Network error during password update.", "error");
    }
  };

  return (
    <div className="container mx-auto py-10 px-2 sm:px-4"> {/* Adjusted container padding */}
      <div className="max-w-full sm:max-w-sm md:max-w-lg lg:max-w-3xl mx-auto bg-white dark:bg-black text-white rounded-lg shadow-lg p-4 sm:p-6"> {/* Adjusted max-width and padding */}
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md mb-3">
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          {/* Upload file (base64) */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
              dark:file:bg-blue-700 dark:file:text-white dark:hover:file:bg-blue-600"
          />

          {/* Enter URL */}
          <input
            type="text"
            placeholder="Or paste public image URL here"
            className="mt-3 w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={async (e) => {
              const url = e.target.value.trim();
              if (url.startsWith("http") || url.startsWith("data:image")) {
                setAvatarPreview(url);
                localStorage.setItem(`avatar_${currentUser.id}`, url);

                try {
                  const res = await fetch(`${API_BASE_URL}/api/user/update-avatar`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: currentUser.id, profileUrl: url }),
                  });

                  const data = await res.json();
                  if (res.ok) {
                    showGlobalMessage(data.message || "Avatar updated via URL!", "success");
                  } else {
                    showGlobalMessage(data.message || "Failed to update avatar.", "error");
                  }
                } catch (err) {
                  console.error("Avatar update error:", err);
                  showGlobalMessage("Network error while updating avatar.", "error");
                }
              }
            }}
          />

        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-gray-200 dark:border-gray-700">
          {['info', 'email', 'username', 'password'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 // Added to make buttons take equal space
                text-sm sm:text-base md:text-lg // Adjust font size responsively
                px-2 py-2 sm:px-4 // Reduced horizontal padding for smaller screens
                font-semibold transition-all duration-200
                ${activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                }
              `}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {/* Use conditional rendering for shorter labels on small screens */}
              {tab === 'info' ? 'Info' :
               tab === 'email' ? 'Email' :
               tab === 'username' ? 'Username' :
               'Password'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'info' && (
            <div role="tabpanel">
              <h3 className="text-xl font-bold mb-2">User Information</h3>
              <p><strong>Username:</strong> {profileUsername}</p>
              <p><strong>Email:</strong> {profileEmail}</p>
            </div>
          )}

          {activeTab === 'email' && (
            <form onSubmit={handleUpdateEmail} role="tabpanel" className="space-y-4">
              <h3 className="text-xl font-bold">Update Email</h3>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="New Email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md focus:ring-2 focus:ring-yellow-400"
              >
                Update Email
              </button>
            </form>
          )}
          {activeTab === 'username' && (
            <form onSubmit={handleUpdateUsername} role="tabpanel" className="space-y-4">
              <h3 className="text-xl font-bold">Update Username</h3>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="New Username"
                required
                minLength={3}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md focus:ring-2 focus:ring-green-400"
              >
                Update Username
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} role="tabpanel" className="space-y-4">
              <h3 className="text-xl font-bold">Change Password</h3>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Old Password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="New Password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:ring-2 focus:ring-red-500"
              >
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;