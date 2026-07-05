import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout"; // Make sure to import your new layout wrapper

function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    totalBook: 0,
    totalUser: 0,
    totalReview: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Compiling system overview analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Admin 👋</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time server metrics, account stats, and global moderation monitoring tools.
          </p>
        </div>

        {/* Stats Cards Grid Layout */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Total Books Metric Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Books</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalBook}</h3>
              <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 pt-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                Catalog volumes live
              </p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          {/* Total Users Metric Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalUser}</h3>
              <p className="text-[11px] text-emerald-600 font-medium pt-1">
                Registered profiles verified
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          {/* Total Reviews Metric Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reviews</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalReview}</h3>
              <p className="text-[11px] text-purple-600 font-medium pt-1">
                User comments submitted
              </p>
            </div>
            <div className="bg-purple-50 text-purple-600 p-4 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>

        </section>

        {/* Quick Action Cards Block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Console Shortcuts
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Quick links to navigate directly to management sub-systems.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="/admin/books" className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-5 py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 text-center text-sm active:scale-[0.99]">
              Manage Books
            </a>

            <a href="/admin/users" className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 font-medium px-5 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-center text-sm active:scale-[0.99]">
              Manage Users
            </a>

            <a href="/admin/reviews" className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 font-medium px-5 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-center text-sm active:scale-[0.99]">
              Manage Reviews
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;  