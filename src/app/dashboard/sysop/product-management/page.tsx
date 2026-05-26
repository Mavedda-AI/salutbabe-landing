"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";

export default function AdminListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);

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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
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
                  <button onClick={() => setSelectedListing(listing)} className="text-xs font-bold text-indigo-500 hover:underline">View Details</button>
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

      {selectedListing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedListing(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Listing Details</h3>
              <button onClick={() => setSelectedListing(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Title</h4>
                     <p className="font-bold text-slate-900">{selectedListing.title || '-'}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</h4>
                     <p className="text-sm text-slate-600 leading-relaxed">{selectedListing.description || '-'}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price</h4>
                     <p className="font-black text-slate-900 text-xl">₺{selectedListing.price}</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Seller</h4>
                     <p className="font-bold text-slate-900">{selectedListing.seller?.userName} {selectedListing.seller?.userSurname}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                     <span className={`px-3 py-1 rounded-md text-xs font-bold ${selectedListing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : selectedListing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                        {selectedListing.status}
                     </span>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category & Brand</h4>
                     <p className="text-sm text-slate-600">
                        {selectedListing.category?.name || selectedListing.categoryID || 'Unknown Category'} - {selectedListing.brand?.name || selectedListing.brand || 'No Brand'}
                     </p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Condition</h4>
                     <p className="text-sm text-slate-600">{selectedListing.condition || '-'}</p>
                   </div>
                </div>
              </div>

              {selectedListing.photos && selectedListing.photos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Photos</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {selectedListing.photos.map((photo: any, idx: number) => (
                      <div key={idx} className="w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                        <img src={typeof photo === 'string' ? photo : photo.url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
               {selectedListing.status === 'PENDING' && (
                 <>
                   <button 
                    onClick={() => { updateStatus(selectedListing.listingID, 'REJECTED'); setSelectedListing({...selectedListing, status: 'REJECTED'}); }} 
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                   >
                     Reject
                   </button>
                   <button 
                    onClick={() => { updateStatus(selectedListing.listingID, 'ACTIVE'); setSelectedListing({...selectedListing, status: 'ACTIVE'}); }} 
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                   >
                     Approve
                   </button>
                 </>
               )}
               {selectedListing.status === 'ACTIVE' && (
                 <button 
                  onClick={() => { updateStatus(selectedListing.listingID, 'PASSIVE'); setSelectedListing({...selectedListing, status: 'PASSIVE'}); }} 
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-200 hover:bg-slate-300 transition-colors"
                 >
                   Deactivate
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
