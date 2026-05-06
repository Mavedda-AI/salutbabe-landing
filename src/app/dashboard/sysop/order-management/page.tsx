"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/orders"), {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.payload?.orders) setOrders(data.payload.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-slate-500 font-bold">Loading orders...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Manage Orders</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Buyer</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderID} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="p-4 text-sm font-medium text-slate-900">
                  {order.orderNumber || order.orderID.substring(0, 8)}
                </td>
                <td className="p-4 text-slate-600">
                  {order.buyer?.userName} {order.buyer?.userSurname}
                </td>
                <td className="p-4 text-slate-900 font-bold">₺{order.totalAmount}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
