import React from 'react';
import {Call02Icon, Location01Icon, Mail01Icon} from 'hugeicons-react';

export const metadata = {
  title: 'Contact Us | SalutBabe',
  description: 'Get in touch with the SalutBabe team for support, inquiries, or feedback.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-inter)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            We'd love to hear from you. Please fill out this form or shoot us an email.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--global-radius)] shadow-[var(--shadow-soft)] overflow-hidden flex flex-col md:flex-row">
          {/* Contact Information */}
          <div className="bg-[var(--color-primary)] text-white p-8 md:w-2/5 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail01Icon className="w-6 h-6 mr-4 opacity-80 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="opacity-80">support@salutbabe.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Call02Icon className="w-6 h-6 mr-4 opacity-80 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="opacity-80">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Location01Icon className="w-6 h-6 mr-4 opacity-80 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Headquarters</h3>
                    <p className="opacity-80">123 Fashion Ave<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 opacity-80 text-sm">
              <p>We typically respond within 24 hours on business days.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 md:w-3/5">
            <form className="space-y-6" action="#">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    name="first-name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all outline-none text-[var(--color-text-primary)]"
                    placeholder="Jane"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    name="last-name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all outline-none text-[var(--color-text-primary)]"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all outline-none text-[var(--color-text-primary)]"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all outline-none text-[var(--color-text-primary)]"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all outline-none resize-y text-[var(--color-text-primary)]"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full bg-[var(--color-primary)] hover:bg-[#4eb3ab] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
