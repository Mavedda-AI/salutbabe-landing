import React from "react";

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Contact</h1>
        <p className="text-neutral-700 text-lg mb-8">You can reach us using the contact channels below. We will get back to you as soon as possible.</p>
        <ul className="list-disc pl-6 text-neutral-700 mb-8 space-y-2">
          <li>Email: <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a></li>
          <li>Address: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
          <li>Phone: 0 (555) 123 45 67</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Working Hours</h2>
        <p className="mb-6 text-neutral-700">Weekdays: 09:00 - 18:00<br/>Saturday: 10:00 - 16:00<br/>Sunday: Closed</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Write to Us</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full border rounded px-3 py-2" />
          <input type="email" placeholder="Your Email" className="w-full border rounded px-3 py-2" />
          <textarea placeholder="Your Message" className="w-full border rounded px-3 py-2" rows={4}></textarea>
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold">Send</button>
        </form>
      </div>
    </main>
  );
}
