import React from "react";

export default function CommercialCommunicationConsentPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Commercial Communication Consent</h1>
        <p className="text-neutral-700 text-lg mb-8">Salutbabe requests your consent to send you commercial electronic messages for campaigns, announcements, and information purposes.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Scope of Consent</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Campaign and opportunity notifications</li>
          <li>News and updates</li>
          <li>Surveys and satisfaction studies</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Right of Withdrawal</h2>
        <p className="mb-6 text-neutral-700">You can withdraw your consent at any time. To withdraw, send an email to <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a>.</p>
        <p className="text-neutral-600">For more information, please contact us.</p>
      </div>
    </main>
  );
}
