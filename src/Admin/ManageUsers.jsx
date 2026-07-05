import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function ManageUsers() {
 const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemUsers();
  }, []);

  const fetchSystemUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Target your administrative users retrieval endpoint
      const res = await axios.get(`${API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data)
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error pulling system users database log metrics:", error);
      setUsers([]); // Fallback to clear array if route mapping varies
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const currentAdminId = localStorage.getItem("id");
    
    // Prevent self-deletion accidents down in the schema execution line
    if (String(userId) === String(currentAdminId)) {
      alert("Security Error: Terminal self-destruction bypass is locked. You cannot delete your own administrative account profile context.");
      return;
    }

    if (!window.confirm("Are you sure you want to completely clear this user profile from the database system registry? All corresponding keys will inherit extraction rules.")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Sync state array metrics seamlessly upon deletion approval confirmation response frames
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error managing user pruning sequence transaction logs:", error);
      alert("Failed to drop selected user object from registry tables index.");
    }
  };

  // Inline filter engine evaluating query tags against user details or row references
  const filteredUsers = users.filter((u) => {
    const nameMatch = u.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = u.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = String(u.id).includes(searchQuery);
    return nameMatch || emailMatch || roleMatch || idMatch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Core Block View Heading Header Area Panel */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Identity Indexes</h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit community reader log entries, review role authorization parameters, and clean inactive user profiles.</p>
        </div>

        {/* Console Query Filter Input Layer Strip */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search accounts by name, email string, or authority role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Database Grid Mapping Table Matrix Core Interface */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Querying platform identities directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto p-6">
            <p className="text-sm font-bold text-slate-700">No profile signatures matched workspace queries</p>
            <p className="text-xs text-slate-400 mt-0.5">Double check target properties or invite external reader registration events.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3.5">ID No.</th>
                    <th className="px-6 py-3.5">Full Name</th>
                    <th className="px-6 py-3.5">Email Destination</th>
                    <th className="px-6 py-3.5 text-center">Authorization Level</th>
                    <th className="px-6 py-3.5 text-right">System Override Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((user) => {
                    const isSelf = String(user.id) === String(localStorage.getItem("id"));
                    
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/40 transition-colors group">
                        {/* Primary key identifier string label block cell column line */}
                        <td className="px-6 py-4 font-mono text-slate-400">#{user.id}</td>
                        
                        {/* Username label display row data slot container */}
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {user.name || user.email?.split("@")[0] || "Unnamed Identity"}
                          {isSelf && (
                            <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded ml-1.5 font-bold uppercase tracking-wider">
                              Active Admin
                            </span>
                          )}
                        </td>

                        {/* Full destination registration email data cell value */}
                        <td className="px-6 py-4 text-slate-600 font-medium">{user.email || "No Email Registered"}</td>

                        {/* Interactive dynamic role badge mapping indicator modules styles */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                            user.role === "ADMIN"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }`}>
                            {user.role || "USER"}
                          </span>
                        </td>

                        {/* Mod trigger elements command parameters buttons strip line links layout */}
                        <td className="px-6 py-4 text-right opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isSelf}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                              isSelf
                                ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                                : "border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 shadow-2xs active:scale-[0.98]"
                            }`}
                          >
                            Revoke Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageUsers;