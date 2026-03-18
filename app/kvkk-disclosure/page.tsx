import React from "react";

export default function KvkkDisclosurePage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">KVKK Disclosure</h1>
        <p className="text-neutral-700 text-lg mb-8">Protecting your personal data and privacy is our priority. In accordance with the Law on the Protection of Personal Data No. 6698 (KVKK), we would like to inform you about the processing of your data.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Data Controller</h2>
        <p className="mb-6 text-neutral-700">Mavedda Teknoloji A.Ş. - Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Processed Personal Data</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Identity and contact information</li>
          <li>User transactions and history</li>
          <li>IP and device information</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Purposes of Data Processing</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>To provide and improve services</li>
          <li>To fulfill legal obligations</li>
          <li>Statistical analysis and reporting</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Your Rights</h2>
        <p className="mb-6 text-neutral-700">Under KVKK, you can request information about your data, request correction or deletion. For all requests, contact <a href="mailto:kvkk@salutbabe.com" className="underline text-blue-700">kvkk@salutbabe.com</a>.</p>
      </div>
    </main>
  );
}
