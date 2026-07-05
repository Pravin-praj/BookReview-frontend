import React, { useState ,useEffect} from "react";
import axios from "axios";
function Navbar() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);



  // Mock user data - replace with your auth state/localStorage logic
    const [user, setUser] = useState({
        name: "User Name",
        email: ""
    });

useEffect(() => {
userInfo();
},[])

const userInfo = async() => {
    const response=await axios.get(`${API_URL}/auth/users/${localStorage.getItem("id")}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    // Do something with the user info, e.g., set it in state
    
    setUser({
        name: response.data.name,
        email: response.data.email
    });
};


function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
  window.location.href = "/login"; // Redirect to login page after logout
}

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left: Logo & Core Navigation */}
          <div className="flex items-center gap-8">
            {/* Brand Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                LitCritique
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <a href="/user/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50/60">
                Dashboard
              </a>
              <a href="/user/books" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                Browse Books
              </a>
              <a href="/user/reviews" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                My Reviews
              </a>
            </div>
          </div>

          {/* Right: User Profile Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            
            {/* Desktop User Dropdown */}
            <div className="relative hidden md:inline-block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all focus:outline-none"
              >
                <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <a href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Your Profile</a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Settings</a>
                  <div className="border-t border-slate-100 mt-2 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/60 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-screen opacity-100 border-b border-slate-200 bg-white" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-4 pt-2 pb-4 space-y-1.5 shadow-inner bg-slate-50/50">
          <a href="/dashboard" className="block px-3 py-2.5 rounded-xl text-base font-medium text-indigo-600 bg-indigo-50">
            Dashboard
          </a>
          <a href="/user/books" className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            Browse Books
          </a>
          <a href="/user/reviews" className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            My Reviews
          </a>
          
          {/* Mobile User Metadata & Actions */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <div className="flex items-center px-3 mb-3">
              <span className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <a href="/profile" className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-100">Your Profile</a>
            <a href="/settings" className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-100">Settings</a>
            <button 
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 mt-2 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;