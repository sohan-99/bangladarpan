import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWPPostById, fetchWPPosts } from '@/lib/wp';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  
  const post = await fetchWPPostById(id);
  
  if (!post) {
    notFound();
  }

  // Fetch related/latest news for sidebar
  const relatedNews = await fetchWPPosts(6);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-4">
        <Header />
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600">হোম</Link>
              <span className="mx-2">/</span>
              <span>সংবাদ</span>
            </div>

            {/* Article */}
            <article className="bg-white">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
                <span>{formatDate(post.date)}</span>
              </div>

              {/* Featured Image */}
              {post.image && (
                <div className="relative w-full h-[400px] md:h-[500px] mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-gray-700 font-medium mb-6 leading-relaxed border-l-4 border-red-600 pl-4 bg-gray-50 p-4">
                  {post.excerpt}
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                }}
              />

              {/* Share Buttons */}
              {/* <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3">শেয়ার করুন</h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    ফেসবুক
                  </button>
                  <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors">
                    টুইটার
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    হোয়াটসঅ্যাপ
                  </button>
                </div>
              </div> */}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-600">
                সর্বশেষ সংবাদ
              </h2>
              <div className="space-y-4">
                {relatedNews.map((news: { id: string | number; title: string; image?: string | null; date: string }) => (
                  <Link href={`/news/${news.id}`} key={news.id}>
                  <div className="flex gap-3 pb-4 border-b border-gray-200 hover:bg-gray-50 transition-colors p-2 rounded">
                    <div className="relative w-24 h-20 shrink-0">
                    <Image
                      src={news.image as string}
                      alt={news.title}
                      fill
                      unoptimized
                      className="object-cover rounded"
                    />
                    </div>
                    <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 mb-1 hover:text-red-600">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">{formatDate(news.date)}</p>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await fetchWPPostById(id);

  if (!post) {
    return {
      title: 'সংবাদ পাওয়া যায়নি',
    };
  }

  return {
    title: `${post.title} - বাংলাদর্পণ`,
    description: post.excerpt || post.title,
  };
}
