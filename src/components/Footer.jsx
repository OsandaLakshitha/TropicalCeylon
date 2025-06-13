import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1a759f] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold">TropicalCeylon</h3>
            <p className="mt-2">Discover Sri Lanka’s finest hotels.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/booking" className="hover:text-[#34c759]">Booking</a></li>
              <li><a href="/about" className="hover:text-[#34c759]">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="mt-2">Email: info@tropicalceylon.com</p>
            <p>Phone: +94 123 456 789</p>
          </div>
        </div>
        <p className="text-center mt-8">© 2025 TropicalCeylon. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;