import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">User Agreement and Privacy Policy</h1>

        <h2 className="text-2xl font-semibold mb-4">We Take Your Privacy Seriously</h2>
        <p className="mb-4">
          The General Data Protection Regulation (GDPR) governs how personal data is stored, handled, and on what legal grounds it is processed. It’s also important to us that you feel secure about how we handle your personal information. Below, we explain how this all works.
        </p>
        <p className="mb-4">
          If you no longer wish for us to store your data, you need to contact us and request the termination of your membership.
        </p>

        <h2 className="text-2xl font-semibold mb-4">What Data Do We Store?</h2>
        <p className="mb-4">
          We always store your username, password, email address, and IP addresses. Additionally, you can voluntarily save your avatar, name, location, occupation, and contact details for other services in your profile. In some cases, you may be required to provide additional information, such as for participating in a contest or attending an event.
        </p>
        <p className="mb-4">
          We retain personal data as long as it is necessary for the purposes it was collected or as long as required by laws and regulations.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Why Do We Store Your Data?</h2>
        <p className="mb-4">
          We store your data in our user database to:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Identify you as a user.</li>
          <li>Save personal settings.</li>
          <li>Contact you for administration and support purposes.</li>
          <li>Analyze service usage to improve user experience.</li>
          <li>Maintain data security and prevent misuse of our services.</li>
        </ul>
        <p className="mb-4">
          Your email address will only be used for notifications and newsletters if you have opted in via your personal settings.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Security and Personal Integrity</h2>
        <p className="mb-4">
          We take personal integrity very seriously and follow a strict privacy policy. This means that sensitive data, such as email addresses and IP addresses, is treated confidentially. You can choose not to provide your real name and remain anonymous.
        </p>
        <p className="mb-4">
          We regularly implement measures to maintain good security and prevent data breaches. If a breach occurs, we will notify you and contact the authorities.
        </p>
        <p className="mb-4">
          User data is handled only by authorized administrators acting on behalf of our company.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          You can contact us to:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Request the deletion of your data.</li>
          <li>Request a copy or transfer of your data.</li>
        </ul>
        <p className="mb-4">
          Note: User-generated content, such as posts or comments, may be retained even after account deletion to maintain the integrity of the platform.
        </p>

        <h2 className="text-2xl font-semibold mb-4">For Users Under 16</h2>
        <p className="mb-4">
          If you are under 16 years old, we require parental consent to store and process your data. Please contact us with your guardian to set up a special user agreement.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have questions about this agreement or wish to exercise your rights, you can contact us through our contact form or by writing to:
        </p>
        <p className="mb-4">
          <strong>[Your Company Name]</strong><br />
          [Your Company Address]<br />
          [City, ZIP Code]
        </p>
        <p className="mb-4">
          We will handle your request as quickly as possible.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
