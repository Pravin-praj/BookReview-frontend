import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function MyReviews() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Inline editing state tracking handles
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [updatingId, setUpdatingId] = useState(null);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (userId) {
      fetchMyReviews();
    }
  }, [userId]);

  const fetchMyReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/review/myreview/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("My Reviews Data:", res.data);
      setReviews(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching personalized user reviews:", error);
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditComment(review.comments);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditComment("");
  };

  const handleUpdateReview = async (e, review) => {
    e.preventDefault();
    if (!editComment.trim()) return;

    setUpdatingId(review.id);
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        id: review.id,
        rating: parseInt(editRating, 10),
        comments: editComment,
        userId: userId,
        bookId: review.bookId || review.book?.id // Fallback protection depending on DTO key name
      };

      await axios.post(`${API_URL}/review/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditingReviewId(null);
      fetchMyReviews(); // Refresh feed view state data
    } catch (error) {
      console.error("Error modifying review item line:", error);
      alert("Failed to modify your changes. Please verify field properties.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to permanently delete this review from your catalog history?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/review/delete/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Filter the deleted item out of state instantly for fluid visual pacing feedback
      setReviews(reviews.filter(rev => rev.id !== reviewId));
    } catch (error) {
      console.error("Error requesting comment row extraction summary:", error);
      alert("Failed to remove review context parameters.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
        <main className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8">
          
          {/* Header Block Section */}
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              My Contributions
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review history log files and personal feedback records cataloged across your active account profile.
            </p>
          </div>

          {/* Conditional Layout Engine */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-500">Parsing contributions directory...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
              <div className="bg-slate-50 text-slate-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">No reviews found</h3>
              <p className="text-sm text-slate-500 mt-1">
                You haven't added any feedback yet. Head over to browse books to submit a review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className={`bg-white border rounded-2xl p-6 shadow-sm transition-all relative ${
                    editingReviewId === rev.id ? "border-amber-300 bg-amber-50/20 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Book contextual reference header banner inside item strip */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                        Reviewed Book Reference
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {rev.bookName || rev.book?.bookName || `Book Record #${rev.bookId}`}
                      </h2>
                    </div>

                    {/* Score readout elements */}
                    {editingReviewId !== rev.id && (
                      <div className="flex items-center text-amber-400 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                        {Array.from({ length: rev.rating || 0 }).map((_, idx) => (
                          <svg key={idx} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inline Form Toggle Conditionals */}
                  {editingReviewId === rev.id ? (
                    <form onSubmit={(e) => handleUpdateReview(e, rev)} className="space-y-4">
                      {/* Interactive Rating adjustment for user profile */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Modify Rating Score</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button 
                              type="button" 
                              key={starVal} 
                              onClick={() => setEditRating(starVal)} 
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              <svg className={`w-6 h-6 ${starVal <= editRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Input edit module */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Update Comment Context</label>
                        <textarea
                          rows="3"
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          required
                          className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={updatingId !== null}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                        >
                          {updatingId === rev.id ? "Updating..." : "Save Updates"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Plain static viewing mode display content */}
                      <p className="text-sm text-slate-600 leading-relaxed break-words pr-20">
                        "{rev.comments}"
                      </p>

                      {/* Action buttons footer drawer elements inside component item block container */}
                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(rev)}
                          className="flex items-center gap-1.5 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 font-semibold px-3 py-1.5 rounded-xl text-xs border border-slate-200 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-xl text-xs border border-slate-200 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}

                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default MyReviews;