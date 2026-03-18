import React from "react";

export default function CorporatePage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Corporate</h1>
        <p className="text-neutral-700 text-lg mb-8">Salutbabe operates under Mavedda Teknoloji A.Ş. With our strong financial infrastructure and experienced team, we make a difference in the sector.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Company Information</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Title: Mavedda Teknoloji A.Ş.</li>
          <li>Address: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
          <li>Tax No: 10375602082</li>
          <li>Founded: 2024</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Our Team</h2>
        <p className="mb-6 text-neutral-700">Our expert developers, customer representatives, and operations team are always here for you.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Contact</h2>
        <p className="text-neutral-600">For corporate partnerships and other requests, contact us at <a href="mailto:kurumsal@salutbabe.com" className="underline text-blue-700">kurumsal@salutbabe.com</a>.</p>
      </div>
    </main>
  );
}
