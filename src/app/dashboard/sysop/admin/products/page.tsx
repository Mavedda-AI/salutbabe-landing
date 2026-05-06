"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../../lib/api";

export default function AdminListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/listings"), {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.payload?.listings) setListings(data.payload.listings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/admin/listings/${id}/status`), {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchListings();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-slate-500 font-bold">Loading listings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Manage Listings</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Listing</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Seller</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Price</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.listingID} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">{listing.title}</td>
                <td className="p-4 text-slate-600">
                  {listing.seller?.userName} {listing.seller?.userSurname}
                </td>
                <td className="p-4 text-slate-900 font-bold">₺{listing.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : listing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                    {listing.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {listing.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(listing.listingID, 'ACTIVE')} className="text-xs font-bold text-green-500 hover:underline">Approve</button>
                      <button onClick={() => updateStatus(listing.listingID, 'REJECTED')} className="text-xs font-bold text-red-500 hover:underline">Reject</button>
                    </>
                  )}
                  {listing.status === 'ACTIVE' && (
                    <button onClick={() => updateStatus(listing.listingID, 'PASSIVE')} className="text-xs font-bold text-slate-500 hover:underline">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No listings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
