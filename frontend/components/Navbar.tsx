'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-white' : 'text-[#9e8ce0] hover:text-white';
  };

  return (
    <nav className="bg-[#4051a4] border-b border-[#2d3a7a] sticky top-0 z-50 transition-all duration-300 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="bg-white text-[#4051a4] px-2 py-1 rounded text-lg shadow-sm">EDU </span>
            <span className="text-white">News</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Exams', 'Results', 'Admissions', 'Jobs', 'Scholarships'].map((item) => {
              const path = `/category/${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={path}
                  className={`text-sm font-bold uppercase tracking-wide transition-colors duration-200 relative group ${isActive(path)}`}
                >
                  {item}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${pathname === path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#9e8ce0] hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#2d3a7a] pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {['Exams', 'Results', 'Admissions', 'Jobs', 'Scholarships'].map((item) => {
                const path = `/category/${item.toLowerCase()}`;
                return (
                  <Link
                    key={item}
                    href={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-bold uppercase tracking-wide px-2 py-1 rounded-lg ${pathname === path ? 'bg-white/20 text-white' : 'text-[#9e8ce0] hover:bg-[#2d3a7a] hover:text-white'}`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
