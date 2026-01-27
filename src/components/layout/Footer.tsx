import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-medium text-white">ChargeSmart EV</span>
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-neutral-400 text-center max-w-xl">
            This tool provides estimates only. Actual costs may vary based on
            utility rate changes and actual usage patterns. Please consult with
            your utility provider for official rate information.
          </p>

          {/* Copyright */}
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} ChargeSmart EV
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
