import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function ManageReviews() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalReviews();
  }, []);

  const fetchGlobalReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Target your global administrative reviews endpoint
      const res = await axios.get(`${API_URL}/review/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data || []);
    } catch (error) {
      console.error("Error fetching system reviews context tracking log arrays:", error);
      // Fallback fallback simulated matrix payload data structure for development continuity tracking
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to completely remove this user submission from the system database? This action cannot be reversed.")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/review/delete/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Inline visual state optimization to immediately drop the record row
      setReviews(reviews.filter((rev) => rev.id !== reviewId));
    } catch (error) {
      console.error("Error committing moderation drop call transaction:", error);
      alert("Failed to delete review row from database schema.");
    }
  };

  // Live matching parsing engine for filter search inputs tracking review text comments or IDs
  const filteredReviews = reviews.filter((rev) => {
    const commentsMatch = rev.comments?.toLowerCase().includes(searchQuery.toLowerCase());
    const reviewerMatch = rev.reviewerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const userIdMatch = String(rev.userId).includes(searchQuery);
    return commentsMatch || reviewerMatch || userIdMatch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Module Area Page Header Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Review Moderation Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit community feedback metrics, inspect ratings data feeds, and prune platform content entries.</p>
        </div>

        {/* Global Search Bar Filter layer component wrapper structural boundary input box */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Filter reviews by comment text, reviewer name, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Dynamic State Array Parsing Tables Row Data Interface Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Reading system moderation blocks...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto p-6">
            <p className="text-sm font-bold text-slate-700">No review metadata matched filter terms</p>
            <p className="text-xs text-slate-400 mt-0.5">Change search keywords or wait for new organic community submissions.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3.5 text-center">ID</th>
                    <th className="px-4 py-3.5">Reviewer Identity</th>
                    <th className="px-4 py-3.5">Book Context</th>
                    <th className="px-6 py-3.5">User Commentary Context</th>
                    <th className="px-4 py-3.5 text-center">Score</th>
                    <th className="px-6 py-3.5 text-right">Moderation Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50/40 transition-colors group">
                      {/* Review Primary Key Entry Item ID */}
                      <td className="px-4 py-4 font-mono text-slate-400 text-center">#{rev.id}</td>
                      
                      {/* User parsing identification cell logic block context */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">
                          {rev.reviewerName || `User #${rev.userId}`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {rev.userId}</div>
                      </td>

                      {/* Book Reference identification key parameter tracking column cells line */}
                      <td className="px-4 py-4 font-medium text-slate-600 max-w-[150px] truncate">
                        {rev.bookName || `Book ID #${rev.bookId}`}
                      </td>

                      {/* Explicit text content layout tracking fields */}
                      <td className="px-6 py-4 text-slate-600 max-w-xs sm:max-w-md break-words leading-relaxed">
                        "{rev.comments}"
                      </td>

                      {/* Evaluated system integer stars generation rating array output display indicators */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ★ {rev.rating}
                        </span>
                      </td>

                      {/* Operational Administrative Mod commands block handlers list actions strip row triggers */}
                      <td className="px-6 py-4 text-right opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 font-bold transition-colors shadow-2xs"
                        >
                          Flag & Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageReviews;