import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function ManageBooks() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal toggle & form lifecycle controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // File and preview states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    bookName: "",
    price: "",
    author: {
      firstName: "",
      lastName: "",
      language: ""
    }
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/book/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched books data:", res.data.content); // Debugging log
      setBooks(res.data.content || []);
    } catch (error) {
      console.error("Error fetching admin catalog collection data summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName" || name === "language") {
      setFormData({
        ...formData,
        author: { ...formData.author, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingBookId(null);
    setFormData({ 
      bookName: "", 
      price: "",
      author: { firstName: "", lastName: "", language: "" } 
    });
    setSelectedFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBookId(book.id);
    setFormData({
      bookName: book.bookName || "",
      price: book.price || "",
      author: {
        firstName: book.author?.firstName || "",
        lastName: book.author?.lastName || "",
        language: book.author?.language || ""
      }
    });
    setSelectedFile(null);
    setImagePreview(book.imageUrl || ""); 
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Append core parameters
      data.append("bookName", formData.bookName);
      data.append("price", formData.price);
      data.append("language", formData.author.language);
      data.append("firstName", formData.author.firstName);
      data.append("lastName", formData.author.lastName);

      // Only append a brand new file if the user picked one
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      };

      if (editingBookId) {
        // 1. Send data to your separate UPDATE API endpoint
        await axios.put(`${API_URL}/book/update/${editingBookId}`, data, config);
      } else {
        // 2. Send data to your separate CREATE API endpoint
        await axios.post(`${API_URL}/book/save`, data, config);
      }

      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error("Error committing dataset changes parameters:", error);
      alert("Failed to submit item metadata. Please verify entity schema values.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (bookId) => {
    if (!window.confirm("Are you sure you want to completely drop this book volume entry? All associated comments will inherit context deletion effects.")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/book/delete/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (error) {
      console.error("Error dropping row sequence item record:", error);
      alert("Failed to drop database row. Verify transaction lock allocations.");
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = book?.bookName?.toLowerCase().includes(query);
    const firstNameMatch = book?.author?.firstName?.toLowerCase().includes(query);
    const lastNameMatch = book?.author?.lastName?.toLowerCase().includes(query);
    const languageMatch = book?.author?.language?.toLowerCase().includes(query);
    
    return titleMatch || firstNameMatch || lastNameMatch || languageMatch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Dynamic Action Header Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Catalog Shelf</h1>
            <p className="text-xs text-slate-500 mt-0.5">Create new book configurations, remove entries, or adjust catalog meta parameters.</p>
          </div>
          
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all tracking-wide shadow-md shadow-indigo-100 self-start sm:self-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add New Book
          </button>
        </div>

        {/* Filter Management Sub-Bar */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search books inside console filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Core Database Render Content Grid/Table View Matrix */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Reading system catalog keys...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto p-6">
            <p className="text-sm font-bold text-slate-700">No records hit catalog indexes</p>
            <p className="text-xs text-slate-400 mt-0.5">Create a clean entity volume to begin initializing array parameters.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3.5">ID</th>
                    <th className="px-6 py-3.5">Cover</th>
                    <th className="px-6 py-3.5">Book Title</th>
                    <th className="px-6 py-3.5">Author Identity</th>
                    <th className="px-6 py-3.5">Language</th> 
                    <th className="px-6 py-3.5">Price</th> 
                    <th className="px-6 py-3.5 text-right">Console Triggers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-slate-400">#{book.id}</td>
                      
                      <td className="px-6 py-4">
                        {book.imageUrl ? (
                          <img 
                            src={book.imageUrl.startsWith('http') ? book.imageUrl : `${API}/RestApi/images/${book.imageUrl}`} 
                            alt={book.bookName} 
                            className="w-10 h-14 object-cover rounded-lg border border-slate-100 shadow-xs"
                            onError={(e) => { e.target.src = "https://placehold.co/40x56?text=No+Cover" }}
                          />
                        ) : (
                          <div className="w-10 h-14 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-medium">
                            N/A
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900">{book.bookName}</td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {book.author ? `${book.author.firstName} ${book.author.lastName || ""}` : "Unspecified"}
                      </td>
                      
                      <td className="px-6 py-4 text-slate-500 font-medium capitalize">
                        {book.author?.language || "—"}
                      </td>
                      
                      <td className="px-6 py-4 font-semibold text-indigo-600">
                        {book.price ? `$${Number(book.price).toFixed(2)}` : "—"}
                      </td>

                      <td className="px-6 py-4 text-right space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(book)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-600 hover:text-amber-700 font-semibold transition-colors"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Entity Modal Overlay Window */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative z-10 animate-in fade-in zoom-in-95 duration-150 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{editingBookId ? "Update Volume Meta" : "Incorporate Novel Volume"}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Fill configuration slots parameters to update relational rows entries.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Book Title Label</label>
                  <input
                    type="text"
                    name="bookName"
                    value={formData.bookName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter official volume title..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 19.99"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Language</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.author.language}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. English"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Book Cover File</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img 
                        src={imagePreview.startsWith('http') ? imagePreview : `${API_URL}/RestApi/images/${imagePreview}`} 
                        alt="Preview" 
                        className="w-12 h-16 object-cover rounded-lg border border-slate-200"
                        onError={(e) => { e.target.src = "https://placehold.co/40x56?text=Cover" }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Author First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.author.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. George"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Author Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.author.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Orwell"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {submitting ? "Processing transaction..." : editingBookId ? "Save Modifications" : "Commit Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageBooks;