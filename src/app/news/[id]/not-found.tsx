import Link from 'next/link';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-4">
        <Header />
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">৪০৪</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            সংবাদ খুঁজে পাওয়া যায়নি
          </h2>
          <p className="text-gray-600 mb-8">
            দুঃখিত, আপনি যে সংবাদটি খুঁজছেন তা পাওয়া যায়নি বা মুছে ফেলা হয়েছে।
          </p>
          <Link
            href="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
