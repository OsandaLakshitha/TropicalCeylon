import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if we're at the top of the page
      setIsAtTop(currentScrollY < 10);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isAtTop 
          ? 'bg-transparent backdrop-blur-none shadow-none' 
          : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/20'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${
            isAtTop ? 'text-white drop-shadow-md' : 'text-gray-900'
          }`}>
            TropicalCeylon
          </div>
          
          {/* Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <a 
                href="/" 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isAtTop 
                    ? 'text-white/90 hover:text-white drop-shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="/booking" 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isAtTop 
                    ? 'text-white/90 hover:text-white drop-shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Booking
              </a>
            </li>
            <li>
              <a 
                href="/about" 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isAtTop 
                    ? 'text-white/90 hover:text-white drop-shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </a>
            </li>
          </ul>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="/booking"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 ${
                isAtTop
                  ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
              }`}
            >
              Book Now
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 rounded-md transition-colors duration-300 ${
              isAtTop 
                ? 'text-white hover:bg-white/10' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;