import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../User/Navbar";
function UserDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReviews: 0,
  });

  const username = localStorage.getItem("email") || "User";
  const userId = localStorage.getItem("id") || null;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const booksRes = await axios.get(
        `${API_URL}/book/total`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reviewsRes = await axios.get(
        `${API_URL}/review/myreview/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        totalBooks: booksRes.data,
        totalReviews: reviewsRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Main Content Dashboard Container */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-10">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl shadow-indigo-950/10">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Welcome back, <span className="text-indigo-300">{username.split('@')[0]}</span>! 👋
            </h2>
            <p className="text-indigo-100 text-base sm:text-lg opacity-90 leading-relaxed">
              Your personal reading hub is up to date. Dive back into your collection or see what fellow readers are saying.
            </p>
          </div>
        </div>

        {/* Analytics Cards Grid */}
        <section className="grid sm:grid-cols-2 gap-6">
          {/* Books Metric Card */}
          <div className="group relative bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                  Catalog Size
                </span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {stats.totalBooks}
                </h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Available books to explore
                </p>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl transition-colors group-hover:bg-indigo-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          {/* Reviews Metric Card */}
          <div className="group relative bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                  Contributions
                </span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {stats.totalReviews}
                </h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Reviews written by you
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl transition-colors group-hover:bg-emerald-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Quick Actions
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Easily navigate shortcuts to manage your collection or discover new releases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.99]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Books Catalog</span>
            </button>

            <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 font-medium px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-400 active:scale-[0.99]">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>View My Reviews</span>
            </button>
          </div>
        </section>

      </main>
    </div>
    </>
  );
}

export default UserDashboard;