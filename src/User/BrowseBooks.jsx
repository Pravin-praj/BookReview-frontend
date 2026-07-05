import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function BrowseBooks() {
const API_URL = import.meta.env.VITE_API_URL;
const [page, setPage] = useState(0);
const [size] = useState(5); // books per page
const [totalPages, setTotalPages] = useState(0);

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // States for Review Modal/Drawer Window
  const [activeBook, setActiveBook] = useState(null);
  const [bookReviews, setBookReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Form submission states
  const [userRating, setUserRating] = useState(5); 
  const [userComment, setUserComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Editing state machine hooks
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Retrieve current logged-in user info from localStorage
  const currentUserId = localStorage.getItem("id");
  const currentUserEmail = localStorage.getItem("email") || "Me";
  
  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
     const res = await axios.get(
    `${API_URL}/book/books?page=${page}&size=${size}`,
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);
      setBooks(res.data.content || []);
      setPage(res.data.number);
    setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  // Open Drawer and fetch comments for a specific book
  const openReviewsDrawer = async (book) => {
    setActiveBook(book);
    setReviewsLoading(true);
    resetReviewForm();
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/review/book/${book.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookReviews(res.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setBookReviews([]); 
    } finally {
      setReviewsLoading(false);
    }
  };

  // Switch form to edit mode and populate values
  const startEditingReview = (review) => {
    setEditingReviewId(review.id);
    setUserRating(review.rating);
    setUserComment(review.comments);
  };

  // Handle Review Deletion
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/review/delete/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (editingReviewId === reviewId) {
        resetReviewForm();
      }

      openReviewsDrawer(activeBook);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  const resetReviewForm = () => {
    setEditingReviewId(null);
    setUserComment("");
    setUserRating(5);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        rating: parseInt(userRating, 10), 
        comments: userComment,
        userId: currentUserId,
        bookId: activeBook.id
      };

      if (editingReviewId) {
        const updatePayload = { ...payload, id: editingReviewId };
        await axios.put(`${API_URL}/review/update/${editingReviewId}`, updatePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/review/save`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetReviewForm();
      openReviewsDrawer(activeBook);
    } catch (error) {
      console.error("Error handling review transaction submission:", error);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = book.bookName?.toLowerCase().includes(query);
    const matchesFirstName = book.author?.firstName?.toLowerCase().includes(query);
    const matchesLastName = book.author?.lastName?.toLowerCase().includes(query);
    const matchesLanguage = book.author?.language?.toLowerCase().includes(query);
    
    return matchesTitle || matchesFirstName || matchesLastName || matchesLanguage;
  });

  const resolveReviewerName = (review) => {
    if (review.reviewerName) return review.reviewerName;
    if (String(review.userId) === String(currentUserId)) {
      return currentUserEmail.split("@")[0] + " (You)";
    }
    return `User #${review.userId}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased relative">
        <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8">
          
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Browse Library
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Discover your next great read from our community collection.
              </p>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-xl self-start sm:self-center">
              Showing <span className="text-indigo-600 font-bold">{filteredBooks.length}</span> books
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Grid Layout Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-500">Loading library shelf...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800">No books found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adapting your search parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                  
                  {/* Real Book Cover Image Integration */}
                  <div className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden border-b border-slate-100 flex items-center justify-center">
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl.startsWith('http') ? book.imageUrl : `http://localhost:8085/RestApi/images/${book.imageUrl}`} 
                        alt={book.bookName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Cover+Available" }}
                      />
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        <svg className="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-xs font-medium">No Cover Image</span>
                      </div>
                    )}
                  </div>

                  {/* Book Text Area info */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2" title={book.bookName}>
                        {book.bookName}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase block">AUTHOR</span>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">
                            {book.author ? `${book.author.firstName} ${book.author.lastName || ""}` : "Unspecified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase block">LANGUAGE</span>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5 capitalize truncate">
                            {book.author?.language || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Action Trigger & Price Display Section */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase block">PRICE</span>
                        <p className="text-sm font-bold text-indigo-600 mt-0.5">
                          {book.price ? `$${Number(book.price).toFixed(2)}` : "—"}
                        </p>
                      </div>

                      <button 
                        onClick={() => openReviewsDrawer(book)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white font-semibold text-xs px-3 py-2.5 rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Reviews
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>

        {/* Slide-out Sidebar Review Drawer Panel Overlay */}
        {activeBook && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setActiveBook(null)} />

            {/* Panel Element */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Optional small thumbnail in review drawer header */}
                  {activeBook.imageUrl && (
                    <img 
                      src={activeBook.imageUrl.startsWith('http') ? activeBook.imageUrl : `http://localhost:8085/RestApi/images/${activeBook.imageUrl}`} 
                      alt="" 
                      className="w-8 h-10 object-cover rounded-md border border-slate-200 bg-white"
                      onError={(e) => { e.style.display = 'none' }}
                    />
                  )}
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900 truncate max-w-[240px]" title={activeBook.bookName}>
                      {activeBook.bookName}
                    </h2>
                    <p className="text-xs text-slate-500">Reviews & Community Rating</p>
                  </div>
                </div>
                <button onClick={() => setActiveBook(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Body - Split scrollable list section */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Add/Edit Review Form Segment */}
                <form onSubmit={handleReviewSubmit} className={`border rounded-2xl p-4 space-y-4 transition-colors ${editingReviewId ? "bg-amber-50/50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">
                      {editingReviewId ? "Modify your existing review" : "Share your thoughts"}
                    </h4>
                    {editingReviewId && (
                      <button 
                        type="button" 
                        onClick={resetReviewForm}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  
                  {/* Interactive Star Picker */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setUserRating(starValue)}
                          className="focus:outline-none transition-transform active:scale-90"
                        >
                          <svg 
                            className={`w-7 h-7 ${starValue <= userRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Review Comment</label>
                    <textarea
                      rows="3"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Write your constructive review here..."
                      required
                      className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full font-medium text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 text-white ${editingReviewId ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {submitting ? "Processing..." : editingReviewId ? "Update My Review" : "Submit Review"}
                  </button>
                </form>

                {/* 2. Existing Comments Render list segment */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">User Reviews Feed</h4>
                  
                  {reviewsLoading ? (
                    <p className="text-sm text-slate-500 text-center py-4">Fetching comment thread...</p>
                  ) : bookReviews.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 p-4">
                      <p className="text-sm font-medium">No reviews recorded yet.</p>
                      <p className="text-xs mt-0.5">Be the first to share your input above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookReviews.map((rev) => {
                        const isMyReview = rev.userId && currentUserId && String(rev.userId) === String(currentUserId);

                        return (
                          <div key={rev.id} className="border border-slate-100 bg-white shadow-xs p-4 rounded-xl space-y-2 relative group/item">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">
                                {resolveReviewerName(rev)}
                              </span>
                              <div className="flex items-center text-amber-400">
                                {Array.from({ length: rev.rating || 0 }).map((_, idx) => (
                                  <svg key={idx} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 leading-relaxed break-words pr-24">{rev.comments}</p>
                            
                            {isMyReview && (
                              <div className="absolute right-3 bottom-3 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEditingReview(rev)}
                                  className="flex items-center gap-1 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 font-semibold px-2 py-1 rounded-md text-[11px] border border-slate-200 transition-colors"
                                >
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="flex items-center gap-1 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md text-[11px] border border-slate-200 transition-colors"
                                >
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center gap-3 mt-8">
    <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
        Previous
    </button>

    <span>
        Page {page + 1} of {totalPages}
    </span>

    <button
        disabled={page === totalPages - 1}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
    >
        Next
    </button>
</div>
    </>
  );
}

export default BrowseBooks;