"use client";

import React, {useEffect, useState} from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.payload?.users) setUsers(data.payload.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'block' | 'unblock') => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/admin/users/${id}/${action}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-slate-500 font-bold">Loading users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Manage Users</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userID} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{user.userName} {user.userSurname}</div>
                  <div className="text-xs text-slate-500">@{user.userNickname}</div>
                </td>
                <td className="p-4 text-slate-600">{user.eMail}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'ACTIVE' : 'BLOCKED'}
                  </span>
                </td>
                <td className="p-4">
                  {user.isActive ? (
                    <button onClick={() => handleAction(user.userID, 'block')} className="text-xs font-bold text-red-500 hover:underline">Block</button>
                  ) : (
                    <button onClick={() => handleAction(user.userID, 'unblock')} className="text-xs font-bold text-green-500 hover:underline">Unblock</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
