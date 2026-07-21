import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SignUp() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    // Validate if passwords match natively on the frontend
    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (!formData.agreeToTerms) {
      setStatusMessage({ type: "error", text: "You must accept the terms and conditions." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: "USER"
      };

      await axios.post(`${API_URL}/auth/signup`, payload, {
        headers: { "Content-Type": "application/json" }
      });

      setStatusMessage({ type: "success", text: "Registration successful! Redirecting to login..." });
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup failed:", error);
      const msg = error.response?.data?.message || "An error occurred while creating your account.";
      setStatusMessage({ type: "error", text: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Left Cover Banner Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-900 via-indigo-700 to-indigo-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="text-white max-w-md space-y-6 relative z-10">
          <div className="inline-flex bg-white/10 p-3 rounded-2xl backdrop-blur-md mb-2">
            <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white sm:text-5xl">
            Join the Club
          </h1>
          <p className="text-indigo-100 text-lg opacity-90 leading-relaxed">
            Create an account to start reviewing books, cataloging your contributions, and sharing tracking feedback with readers.
          </p>
        </div>
      </div>

      {/* Right Interaction Registration Container Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 sm:p-12">
        <div className="bg-white border border-slate-200/60 shadow-xl rounded-3xl w-full max-w-md p-8 sm:p-10 space-y-6">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-slate-500">
              Get started with your free profile today
            </p>
          </div>

          {statusMessage.text && (
            <div className={`p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
              statusMessage.type === "success" 
                ? "bg-emerald-50 border border-emerald-200 text-emerald-600" 
                : "bg-rose-50 border border-rose-200 text-rose-600"
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
              />
            </div>

            {/* Password Fields Layout Section Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                />
              </div>
            </div>

            {/* View Password Toggle Switch */}
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium focus:outline-none"
              >
                {showPassword ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-slate-600 text-sm">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 mt-0.5"
                />
                <span className="leading-tight">
                  I agree to the <a href="#" className="font-semibold text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-indigo-600 hover:underline">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* Form Submit Registration Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 mt-2 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-indigo-100 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Registering Account..." : "Create Account"}
            </button>
          </form>

          {/* Visual Decorative Divider Line */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">or continue with</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Google OAuth Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.99]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5 flex-shrink-0"
              >
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.8-3.3-11.4-8l-6.6 5.1C9.3 39.5 16.1 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 6.8l6.2 5.2C39.3 36.5 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          {/* Redirect Footer Links */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Already have an account?
              <a href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 ml-1.5 transition-colors">
                Sign In
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignUp;