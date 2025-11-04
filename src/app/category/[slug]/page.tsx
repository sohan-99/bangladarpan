import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWPPostsByCategory } from '@/lib/wp';
import { notFound } from 'next/navigation';

// Category mapping: URL slug -> Display name (in Bengali)
const categoryNames: Record<string, string> = {
  'national': 'জাতীয়',
  'country': 'দেশ',
  'world': 'বিশ্ব',
  'politics': 'রাজনীতি',
  'economy': 'অর্থনীতি',
  'sports': 'খেলা',
  'jobs': 'চাকরি',
  'lifestyle': 'লাইফস্টাইল',
  'entertainment': 'বিনোদন',
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  // Check if category exists
  if (!categoryNames[slug]) {
    notFound();
  }

  const posts = await fetchWPPostsByCategory(slug, 50);
  const categoryDisplayName = categoryNames[slug];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-4">
        <Header />
        <Navigation />
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 pb-3 border-b-4 border-red-600 inline-block">
            {categoryDisplayName}
          </h1>
          <p className="text-gray-600 mt-2">
            {posts.length} টি সংবাদ পাওয়া গেছে
          </p>
        </div>

        {/* News Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((news) => (
              <Link href={`/news/${news.id}`} key={news.id}>
                <div className="group bg-white border border-gray-200 hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block text-red-600 text-xs font-semibold mb-2">
                      {categoryDisplayName}
                    </span>
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors mb-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">{news.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              এই বিভাগে কোনো সংবাদ পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static params for known categories
export async function generateStaticParams() {
  return Object.keys(categoryNames).map((slug) => ({
    slug,
  }));
}

// Add metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categoryDisplayName = categoryNames[slug] || slug;

  return {
    title: `${categoryDisplayName} - বাংলাদর্পণ`,
    description: `${categoryDisplayName} বিভাগের সর্বশেষ সংবাদ`,
  };
}
