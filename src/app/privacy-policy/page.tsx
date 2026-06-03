import React from 'react';
import {File02Icon, LockIcon, Shield02Icon} from 'hugeicons-react';

export const metadata = {
  title: 'Privacy Policy | SalutBabe',
  description: 'Privacy Policy for SalutBabe outlining how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-inter)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-pink)] text-[var(--color-secondary)] mb-6 shadow-sm">
            <Shield02Icon size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--global-radius)] shadow-[var(--shadow-soft)] p-8 md:p-12">
          
          <div className="prose prose-lg max-w-none text-[var(--color-text-secondary)] space-y-8">
            
            <section>
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-primary)]">
                <File02Icon className="text-[var(--color-primary)]" size={28} />
                <h2 className="text-2xl font-bold m-0">1. Introduction</h2>
              </div>
              <p>
                Welcome to SalutBabe ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at support@salutbabe.com.
              </p>
              <p className="mt-4">
                When you visit our website https://salutbabe.com (the "Website"), and more generally, use any of our services (the "Services", which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-primary)]">
                <LockIcon className="text-[var(--color-primary)]" size={28} />
                <h2 className="text-2xl font-bold m-0">2. Information We Collect</h2>
              </div>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Personal Information Provided by You:</strong> We collect names, phone numbers, email addresses, mailing addresses, usernames, passwords, and other similar information.</li>
                <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
                <li><strong>Automatically Collected Information:</strong> We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">3. How We Use Your Information</h2>
              <p>
                We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>To facilitate account creation and logon process.</li>
                <li>To fulfill and manage your orders, payments, returns, and exchanges.</li>
                <li>To post testimonials with your consent.</li>
                <li>Request feedback and to contact you about your use of our Services.</li>
                <li>To protect our Services (for example, for fraud monitoring and prevention).</li>
                <li>To respond to user inquiries/offer support to users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">4. Will Your Information Be Shared With Anyone?</h2>
              <p>
                We only share and disclose your information with the following third parties. We have categorized each party so that you may easily understand the purpose of our data collection and processing practices.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Cloud Computing Services:</strong> Amazon Web Services (AWS), Google Cloud Platform.</li>
                <li><strong>Payment Processors:</strong> Stripe, PayPal, Iyzico.</li>
                <li><strong>Data Analytics:</strong> Google Analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">5. How Long Do We Keep Your Information?</h2>
              <p>
                We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
              </p>
              <p className="mt-4">
                When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">6. Do We Make Updates to This Notice?</h2>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">7. Contact Us</h2>
              <p>
                If you have questions or comments about this notice, you may email us at <strong>support@salutbabe.com</strong> or by post to:
              </p>
              <div className="mt-4 p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--color-border-color)]">
                <p className="font-semibold text-[var(--color-text-primary)]">SalutBabe Inc.</p>
                <p>123 Fashion Ave</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
