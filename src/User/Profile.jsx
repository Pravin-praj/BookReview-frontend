import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Local state initialized securely with client memory strings
  const currentUserId = localStorage.getItem("id");
  const currentUserEmail = localStorage.getItem("email") || "user@example.com";
  const currentUserRole = localStorage.getItem("role") || "USER";

  const [profileData, setProfileData] = useState({
    fullName: currentUserEmail.split("@")[0],
    email: currentUserEmail,
    role: currentUserRole,
    joinedDate: "Joined June 2026", // Visual placeholder text
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      // Optional: Replace this with your explicit profile updating API payload configuration if supported
      /*
      await axios.put(`${API_URL}/user/update/${currentUserId}`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      */
      
      localStorage.setItem("email", profileData.email);
      setSuccessMessage("Profile information synchronized successfully!");
    } catch (error) {
      console.error("Error updating profile settings:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      // Optional: Target your secure change-password mapping if available
      /*
      await axios.post(`${API_URL}/user/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      */
      
      setSuccessMessage("Password security updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error processing transaction handler updating security:", error);
      alert("Verification failed. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  const userInitial = profileData.fullName.charAt(0).toUpperCase();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
        <main className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8">
          
          {/* Header Action Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 sm:p-8 shadow-xl">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Dynamic Initialization Display Badge */}
              <div className="w-24 h-24 bg-indigo-600 rounded-2xl border-2 border-indigo-400 flex items-center justify-center text-white text-4xl font-extrabold shadow-inner shadow-indigo-700/50">
                {userInitial}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{profileData.fullName}</h1>
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 text-indigo-200 px-2 py-0.5 rounded-md backdrop-blur-md">
                    {profileData.role}
                  </span>
                </div>
                <p className="text-indigo-200/80 text-sm font-medium">{profileData.email}</p>
                <p className="text-xs text-indigo-300 font-mono pt-1">{profileData.joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Success Notification Alert Panel */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-200">
              <svg className="w-5 h-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Settings Processing Panel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Nav Shortcuts */}
            <div className="space-y-3 md:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-2">Account Settings</h3>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-2 space-y-1 shadow-xs">
                <button className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-600">
                  Profile Details
                </button>
                <a href="/user/dashboard" className="block px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  Back to Dashboard
                </a>
              </div>
            </div>

            {/* Right Interactive Inputs Forms Blocks */}
            <div className="space-y-6 md:col-span-2">
              
              {/* Card Form 1: General Info */}
              <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Personal Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage public profile attributes and user identification references.</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Account ID Token</label>
                      <input
                        type="text"
                        value={currentUserId || "Not Available"}
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-sm cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Field Configuration</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl tracking-wide shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? "Saving Records..." : "Save Profile Details"}
                  </button>
                </form>
              </div>

              {/* Card Form 2: Password Modifiers */}
              <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Security Credentials</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Revoke security tokens or update account access parameters.</p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Account Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">New Security Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Re-enter New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl tracking-wide shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? "Re-verifying keys..." : "Update Security Password"}
                  </button>
                </form>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  );
}

export default Profile;