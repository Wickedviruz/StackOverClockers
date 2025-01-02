// src/components/Layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-200 border-t border-gray-300 dark:border-[#3B3B3B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Om Oss */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Om StackOverClockers</h3>
            <p className="text-sm">
              Vi är en plattform för tekniska diskussioner, tester och artiklar om programmering och teknik.
            </p>
          </div>

          {/* Snabblänkar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Snabblänkar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/forum"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Artiklar
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Tester
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Nyheter
                </Link>
              </li>
            </ul>
          </div>

          {/* Sociala Medier */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Följ Oss</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <p className="text-sm">support@stackoverclockers.com</p>
            <p className="text-sm">+46 123 456 789</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 dark:border-[#3B3B3B] pt-4">
          <p className="text-sm text-center">
            &copy; 2024 StackOverClockers. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
