// frontend/src/components/Layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer text-defaultText py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} StackOverClockers. Alla rättigheter förbehållna.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="/terms" className="hover:text-highlight text-sm">Användarvillkor</a>
          <a href="/privacy" className="hover:text-highlight text-sm">Integritetspolicy</a>
          <a href="/contact" className="hover:text-highlight text-sm">Kontakt</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
