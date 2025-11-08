'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { MdOutlineArrowDropDown } from 'react-icons/md';
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'হোম', href: '/' },
    { label: 'জাতীয়', href: '/category/national' },
    { label: 'সারা দেশ', href: '/category/country' },
    { label: 'আন্তর্জাতিক', href: '/category/world' },
    { label: 'রাজনীতি', href: '/category/politics' },
    { label: 'অর্থনীতি', href: '/category/economy' },
    { label: 'খেলা', href: '/category/sports' },
    { label: 'চাকরি', href: '/category/jobs' },
    { label: 'জীবনধারা', href: '/category/lifestyle' },
    { label: 'বিনোদন', href: '/category/entertainment' },
    {
      label: 'বিবিধ',
      href: '/category/misc',
      hasDropdown: true,
      subItems: [
        { label: 'মন্তব্য', href: '/category/misc/comment' },
        { label: 'উপ-সম্পাদকীয়', href: '/category/misc/sub-editorial' },
        { label: 'সম্পাদকীয়', href: '/category/misc/editorial' },
        { label: 'শিক্ষা ও শিক্ষাদান', href: '/category/misc/education' },
        { label: 'স্বাস্থ্য', href: '/category/misc/health' },
      ],
    },
  ];

  return (
    <nav className={`${isScrolled ? 'fixed top-0 left-0 right-0 shadow-md' : 'relative'} z-50 bg-white border-t border-b border-gray-400 transition-all duration-300`}>
      <div className="container mx-auto ">
        <div className="hidden lg:flex items-center justify-start">
          <button className="p-5  transition-colors ">
            <HiMenu className="text-xl text-gray-600" />
          </button>

          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setOpenDropdown(index)}
              onMouseLeave={() => item.hasDropdown && setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="relative px-6 py-3 hover:text-yellow-400  transition-colors text-xl whitespace-nowrap inline-flex items-center gap-1"
              >
                {item.label}
                {item.hasDropdown && <MdOutlineArrowDropDown />}
              </Link>

              {item.hasDropdown && openDropdown === index && item.subItems && (
                <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 min-w-40 z-50">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block px-4 py-2.5 text-gray-700  hover:text-yellow-400 transition-colors text-xl border-b border-gray-100 last:border-b-0"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-3 w-full  transition-colors"
          >
            <HiMenu className="text-xl text-gray-600" />
            <nav className="flex items-center gap-3">
              <Link href="/" className="text-gray-700 text-sm">
                হোম
              </Link>
              <Link href="/category/national" className="text-gray-700 text-sm">
                জাতীয়
              </Link>
              <Link href="/category/country" className="text-gray-700 text-sm">
                সারা দেশ
              </Link>
            </nav>
          </button>

          {isMenuOpen && (
            <div className="border-t border-gray-200 bg-white">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-yellow-400 transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
