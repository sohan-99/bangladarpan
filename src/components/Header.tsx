'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IoIosSearch } from 'react-icons/io';
const Header = () => {
  const getCurrentDateInBengali = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleDateString('bn-BD', { month: 'long' });
    const year = date.getFullYear();

    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const dayInBengali = day
      .toString()
      .split('')
      .map((digit) => bengaliNumerals[parseInt(digit)])
      .join('');
    const yearInBengali = year
      .toString()
      .split('')
      .map((digit) => bengaliNumerals[parseInt(digit)])
      .join('');

    const weekdays = [
      'রবিবার',
      'সোমবার',
      'মঙ্গলবার',
      'বুধবার',
      'বৃহস্পতিবার',
      'শুক্রবার',
      'শনিবার',
    ];
    const weekday = weekdays[date.getDay()];

    return `${weekday}, ${dayInBengali} ${month} ${yearInBengali}`;
  };

  return (
    <header>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs md:text-base font-medium ">{getCurrentDateInBengali()}</p>
          </div>

          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image
                src="/assets/logo/banglaDarpan.png"
                alt="bangladarpan"
                width={400}
                height={80}
                className="h-16 md:h-20 w-auto cursor-pointer"
                priority
              />
            </Link>
          </div>

          <div className="flex-1 flex justify-end">
            <button className="p-2 hover:bg-gray-200  transition-colors" aria-label="Search">
              <IoIosSearch className="text-2xl md:text-3xl text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
