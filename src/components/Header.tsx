  'use client';

  import Image from 'next/image';
  import { IoIosSearch } from 'react-icons/io';
  import logo from '../assets/logo/banglaDarpan.png';

const Header = () => {
  const getCurrentDateInBengali = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleDateString('bn-BD', { month: 'long' });
    const year = date.getFullYear();
    
    // Convert numbers to Bengali
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const dayInBengali = day.toString().split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');
    const yearInBengali = year.toString().split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');
    
    const weekdays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const weekday = weekdays[date.getDay()];
    
    return `${weekday}, ${dayInBengali} ${month} ${yearInBengali}`;
  };

  return (
    <header className="bg-gray-100 border-b border-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Date Section */}
          <div className="flex-1">
            <p className="text-xs md:text-base font-semibold">
              {getCurrentDateInBengali()}
            </p>
          </div>

          {/* Logo Section */}
          <div className="flex-1 flex justify-center">
            <Image
              src={logo}
              alt="আজকের পত্রিকা"
              width={400}
              height={80}
              className="h-16 md:h-20 w-auto"
              priority
            />
          </div>

          {/* Search Icon Section */}
          <div className="flex-1 flex justify-end">
            <button 
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Search"
            >
              <IoIosSearch className="text-2xl md:text-3xl text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;